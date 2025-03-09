//TODO
import { Router } from "express";
import user from "../../../controllers/user.controller";
import { updateUserSchema } from "../../../validators";
import { validate, authenticateToken, isAdmin } from "../../../middlewares";

const userRouter: Router = Router();

// Get total number of admin users
userRouter.get("/total", user.getTotalUsers)

// Get all users (Admin only)
userRouter.get("/all", user.getAllUsers);

// Get a specific user by ID (Admin only)
userRouter.get("/:id", user.getUserById);

// Update a user by ID (Admin or self)
userRouter.patch("/:id", validate(updateUserSchema), user.updateUser);

// Delete a user by ID (Admin only)
userRouter.delete("/:id", user.deleteUser);

export default userRouter;