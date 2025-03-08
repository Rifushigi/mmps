//Under development
import { validator } from "../../../middlewares";
import { AuthController } from "../../../controllers";
import { Router } from "express";
import {
    signupSchema,
    loginSchema,
} from "../../../validators";

const {
    login,
    refresh,
    logout,
    signup,
    validateFace
} = new AuthController();

// import {authenticateToken} from "../middlewares";

const authRouter: Router = Router();

// admin or user logs in
authRouter.route("/login").post(validator(loginSchema), login);

authRouter.route("/signup").post(validator(signupSchema), signup)

// checks if the refresh token stored in cookie is valid and renews the accesstoken
authRouter.route("/refresh").get(refresh);

// // reset password after confirming otp
// authRouter.route("/reset").patch(validator(resetPassSchema), resetPassword);

// clears cookies and loggs out user
authRouter.route("/logout").get(logout);
authRouter.route("/validate-face").post(validateFace);

export default authRouter;