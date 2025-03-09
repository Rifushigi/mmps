import { Request, Response, NextFunction } from "express";
import { Quiz } from "../models";
import { QuizResult } from "../models";
import { asyncErrorHandler } from "../middlewares";
import { ValidationError, NotFoundError } from "../middlewares/err.handler.middleware";
import { ApiResponse } from "../interfaces";

class QuizController {

    static createQuiz = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        const quizData = req.body;
        if (typeof quizData !== 'object' || Array.isArray(quizData)) {
            throw new ValidationError("Invalid quiz data format. Expected an object.");
        }
        const newQuiz = await Quiz.create(quizData);
        const response: ApiResponse = {
            status: true,
            message: "Quiz created successfully",
            data: newQuiz
        };
        return res.status(201).json(response);
    });

    static getQuizById = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        const quizId = req.params.id;
        const { userId } = req.query;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            throw new NotFoundError("Quiz not found");
        }
        const hasTaken = await QuizResult.exists({ quizId: quizId, userId });
        const response: ApiResponse = {
            status: true,
            message: "Quiz retrieved successfully",
            data: { quiz, hasTaken }
        };
        return res.json(response);
    });

    static getAllQuizzes = asyncErrorHandler(async (req: Request, res: Response) => {
        const quizzes = await Quiz.find();
        const response: ApiResponse = {
            status: true,
            message: "Quizzes retrieved successfully",
            data: quizzes
        };
        return res.json(response);
    });

    static updateQuiz = asyncErrorHandler(async (req: Request, res: Response) => {
        const quizId = req.params.id;
        const updateData = req.body;
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quizId,
            updateData,
            { new: true }
        );
        if (!updatedQuiz) {
            throw new NotFoundError("Quiz not found");
        }
        const response: ApiResponse = {
            status: true,
            message: "Quiz updated successfully",
            data: updatedQuiz
        };
        return res.json(response);
    });

    static deleteQuiz = asyncErrorHandler(async (req: Request, res: Response) => {
        const quizId = req.params.id;
        const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
        if (!deletedQuiz) {
            throw new NotFoundError("Quiz not found");
        }
        const response: ApiResponse = {
            status: true,
            message: "Quiz deleted successfully"
        };
        return res.json(response);
    });

    static getTotalQuizzes = asyncErrorHandler(async (req: Request, res: Response) => {
        const totalQuizzes = await Quiz.countDocuments();
        const response: ApiResponse = {
            status: true,
            message: "Total quizzes count retrieved successfully",
            data: { totalQuizzes }
        };
        return res.json(response);
    });
}

export default QuizController;
