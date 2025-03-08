import { Request, Response, NextFunction } from "express";
import { User } from "../models";
import { ApiResponse, IUser, RequestWithUser } from "../interfaces";
import { asyncErrorHandler, NotFoundError, UnauthorisedError } from "../middlewares"

export class UserController {
    //TODO
    // public async createUser(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { password, ...otherFields } = req.body;
    //         const hashedPassword: string = hashPassword(password);

    //         // Create a new user object with hashed password and other fields
    //         const newUser: IUser = {
    //             ...otherFields,
    //             isAdmin: req.body.isAdmin || false, // Set isAdmin to false if not provided
    //             hash: hashedPassword,
    //         };

    //         const user = await User.create(newUser);

    //         res.status(201).json({
    //             message: "User created successfully",
    //             data: {
    //                 user: user._id
    //             },
    //         });
    //     } catch (error) {
    //         // Pass any errors to the next middleware for centralized error handling
    //         next(error);
    //     }
    // }

    static getUserById = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        const sanitisedUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        };

        const response: ApiResponse = {
            status: true,
            message: "Successfully retrieved user",
            data: sanitisedUser
        }

        res.json(response);
    })

    static getAllUsers = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        const users = await User.find();
        if (!users) {
            throw new NotFoundError("No user found");
        }
        const sanitisedUsers = users.map((user: IUser) => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        }));
        const response: ApiResponse = {
            status: true,
            message: "Successfully retrieved users",
            data: sanitisedUsers
        }
        res.json(response);
    })


    static updateUser = asyncErrorHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        const updateData = req.body;
        // Check authorization (can only update self or if admin)
        if (!userId && !req.user.isAdmin) {
            throw new UnauthorisedError();
        }
        //TODO
        // Input Validation (optional, but highly recommended)
        // ... (Validate updateData based on your schema) ...
        // Exclude fields that shouldn't be updated directly
        delete updateData.password;
        delete updateData.isAdmin;
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) {
            throw new NotFoundError("User not found")
        }
        // Sanitize the response
        const sanitisedUser = {
            _id: updatedUser._id,
            firstName: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        };
        const response: ApiResponse = {
            status: true,
            message: "Successfully updated user",
            data: sanitisedUser
        }
        res.json(response);
    });

    static deleteUser = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            throw new NotFoundError("User not found");
        }
        const response: ApiResponse = {
            status: true,
            message: "Succesfully deleted user"
        }
        res.json(response);
    });

    static getTotalUsers = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        const totalUsers = await User.countDocuments();
        if (!totalUsers) {
            throw new NotFoundError("No user found");
        }
        const response: ApiResponse = {
            status: true,
            message: "Successfully fetched number of users",
            data: totalUsers
        }
        res.json(response);
    });
}