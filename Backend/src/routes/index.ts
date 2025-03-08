import express, { Express } from "express";

const router: Express = express();

//Router
import auth from "./v1/api/auth.routes";
import user from "./v1/api/user.routes";
import quizRouter from "./v1/api/quiz.routes";
import appRouter from "./v1/api/app.routes";

router.use("/auth", auth);
router.use("/user", user);
router.use("/quiz", quizRouter);
router.use("/", appRouter);

export default router;

