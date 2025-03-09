//TODO
import { Router } from "express";
import quizResult from "../../../controllers/quiz.result.controller";
import quiz from "../../../controllers/quiz.controller"
import { createQuizSchema, updateQuizSchema, } from "../../../validators";
import { validate, authenticateToken, isAdmin } from "../../../middlewares";

const quizRouter: Router = Router();

// Get the total number of quizzes
quizRouter.get("/total", quiz.getTotalQuizzes)

// Create a new quiz (Admin only)
quizRouter.post("/", validate(createQuizSchema), quiz.createQuiz);

// Get a specific quiz by ID
quizRouter.get("/:id", quiz.getQuizById);

// Get all quizzes (potentially paginated)
quizRouter.get("/", quiz.getAllQuizzes);

// Update a quiz by ID (Admin only)
quizRouter.patch("/:id", validate(updateQuizSchema), quiz.updateQuiz);

// Delete a quiz by ID (Admin only)
quizRouter.delete("/:id", quiz.deleteQuiz);

// Get the results of quiz by ID
quizRouter.get('/user/:userId', quizResult.getQuizResultsByUserId);

// save the result of the quiz
quizRouter.post('/quiz-result', quizResult.saveQuizResult);

export default quizRouter;