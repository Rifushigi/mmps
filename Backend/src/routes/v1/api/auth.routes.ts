//Under development
import { validate } from "../../../middlewares";
import auth from "../../../controllers/auth.controller";
import { Router } from "express";
import { signupSchema, loginSchema } from "../../../validators";
// import {authenticateToken} from "../middlewares";

const authRouter: Router = Router();
//TODO
// admin or user logs in
authRouter.post("/login", validate(loginSchema), auth.login);

// user signs up
authRouter.post("/signup", validate(signupSchema), auth.signup)

// checks if the refresh token stored in cookie is valid and renews the accesstoken
authRouter.get("/refresh", auth.refresh);

// // reset password after confirming otp
// authRouter.route("/reset").patch(validator(resetPassSchema), resetPassword);
// clears cookies and loggs out user
authRouter.get("/logout", auth.logout);

// validatees user using biometrics(face features)
authRouter.post("/validate-face", auth.validateFace);

export default authRouter;