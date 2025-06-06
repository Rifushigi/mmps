//Under development
import { User } from "../models";
import { NextFunction, Request, Response } from "express";
import { generateAccessToken, generateRefreshToken, hashPassword, refreshAccessToken } from "../utils";
import * as faceapi from 'face-api.js';
import { asyncErrorHandler, AuthenticationError, ConflictError, NotFoundError, ValidationError } from "../middlewares";
import { ApiResponse } from "../interfaces";
import { refreshCookieConfig } from "../config/security.config";

// TODO
class AuthController {

    static signup = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        const expectedDescriptorLength = 128;
        const { name, email, password, faceDescriptors } = req.body;

        if (!name || !email || !password || !faceDescriptors) {
            throw new ValidationError("All fields are required");
        }

        if (password.length < 8) {
            throw new ValidationError("Password must be at least 8 characters long");
        }

        if (faceDescriptors.length !== expectedDescriptorLength) {
            throw new ValidationError("Face descriptor length mismatch");
        }

        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ConflictError("User with this email already exists");
        }

        // Check for unique face descriptor
        const users = await User.find({});
        for (const user of users) {
            if (!user.faceDescriptors || user.faceDescriptors.length !== faceDescriptors.length) {
                continue; // Skip users with mismatched descriptor lengths or missing face descriptors
            }
            const labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors(
                user.email,
                user.faceDescriptors.map(descriptor => Float32Array.from(descriptor))
            );
            const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
            const bestMatch = faceMatcher.findBestMatch(new Float32Array(faceDescriptors));
            if (bestMatch.distance < 0.6) {
                throw new ConflictError("Face descriptor already exists for another user");
            }
        }

        const hashedPassword: string = hashPassword(password);
        // Create a new user object with hashed password and other fields
        const newUser = {
            name: name,
            email: email,
            isAdmin: req.body.isAdmin || false, // Set isAdmin to false if not provided
            hash: hashedPassword,
            faceDescriptors: faceDescriptors
        };
        const user = await User.create(newUser);
        const sanitisedUser = {
            ...user.toObject(),
            hash: undefined,
            refreshToken: undefined,
            otpExpiresBy: undefined,
        };
        const response: ApiResponse = {
            status: true,
            message: "Successfully created user",
            data: sanitisedUser
        }
        return res.status(201).json(response);
    });

    static login = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        if (password && email) {
            const user: any = await User.login(email, password);
            if (user) {
                const accessToken = await generateAccessToken(user._id);
                const refreshToken = await generateRefreshToken(user._id);
                // Update the user document with the new refresh token
                await User.findByIdAndUpdate(
                    user._id,
                    {
                        refreshToken: refreshToken,
                        accessToken: accessToken
                    },
                    { new: true }
                );
                // Set the refresh token as a cookie
                res.cookie("refreshToken", refreshToken, refreshCookieConfig);
                const sanitisedUser = {
                    ...user.toObject(),
                    email: email,
                    name: user.name,
                    hash: undefined,
                    refreshToken: undefined,
                    otpExpiresBy: undefined,
                };
                // Set the access token in the Authorization header
                res.setHeader('Authorization', `Bearer ${accessToken}`);
                const response: ApiResponse = {
                    status: true,
                    message: "Successfully logged in",
                    data: sanitisedUser
                }
                return res.json(response);

            } else {
                throw new AuthenticationError("Invalid email or password");
            }
        } else {
            // If email or password is missing
            throw new AuthenticationError("Email and password are required");
        }
    });

    static refresh = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { refresh_token } = req.cookies;
        if (!refresh_token) {
            throw new AuthenticationError("No refresh token in cookie");
        }
        // Find the user document associated with the provided refresh token
        const user = await User.findOne({ refresh_token });
        // If no user is found, respond with 404 and an error message
        if (!user) {
            throw new Error("User with refresh token not found");
        }
        const sanitisedUser = {
            ...user.toObject(),
            hash: undefined,
            refreshToken: undefined,
        };
        const token = await refreshAccessToken(refresh_token);
        //TODO
        // Add the token to the cookie
        const response: ApiResponse = {
            status: true,
            message: "Successfully refreshed token",
            data: sanitisedUser
        }
        return res.json(response);
    });

    static logout = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            throw new AuthenticationError("No refresh token in cookie");
        }
        // Find the user document associated with the provided refresh token
        const user = await User.findOne({ refreshToken });
        // If user is not found, clear the refresh token cookie and respond with an error status
        if (!user) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
            });
            throw new NotFoundError("User not found");
        }
        // Update the refresh token to an empty string in the user document and retrieve the updated document
        await User.findByIdAndUpdate(
            user._id,
            {
                refreshToken: " ",
            },
            {
                new: true,
            }
        );

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        
        const response: ApiResponse = {
            status: true,
            message: "Successfully logged out user"
        }
        // Respond with a successful logout status
        return res.json(response);
    });

    static validateFace = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { email, faceDescriptors } = req.body;
        //TODO
        // Log input for debugging
        const user = await User.findOne({ email });
        if (!user) {
            throw new NotFoundError("User not found");
        }
        // Ensure faceDescriptors is an array of arrays
        const normalizedFaceDescriptors = Array.isArray(faceDescriptors[0]) ? faceDescriptors : [faceDescriptors];
        // Check descriptor length
        if (normalizedFaceDescriptors[0].length !== user.faceDescriptors[0].length) {
            throw new AuthenticationError("Face descriptor length mismatch");
        }
        //TODO
        // move the facematch threshold to config dir and find an optimal faceMatchThreshold
        // Define a face match threshold (can be adjusted as needed)
        const faceMatchThreshold = 0.4;
        // Create LabeledFaceDescriptors for the user
        const labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors(
            user.email,
            user.faceDescriptors.map(descriptor => Float32Array.from(descriptor))
        );
        // Create a FaceMatcher
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, faceMatchThreshold);
        // Check if any of the provided descriptors match with the stored descriptors
        const matchResults = normalizedFaceDescriptors.map(providedDescriptor => {
            const bestMatch = faceMatcher.findBestMatch(Float32Array.from(providedDescriptor));
            //TODO
            console.log('Best match distance:', bestMatch.distance);
            return bestMatch.distance < faceMatchThreshold;
        });
        console.log('Match results:', matchResults);
        if (matchResults[0]) {
            const response: ApiResponse = {
                status: true,
                message: "Successfully validated face",
                data: matchResults
            }
            return res.json(response);
        } else {
            throw new AuthenticationError("Failed to validate face")
        }
    });
}

export default AuthController;