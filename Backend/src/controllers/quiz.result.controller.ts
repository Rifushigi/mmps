import { Request, Response, NextFunction } from 'express';
import { QuizResult, Quiz } from '../models';
import { asyncErrorHandler } from '../middlewares';
import { ValidationError, NotFoundError } from '../middlewares/err.handler.middleware';
import { ApiResponse } from '../interfaces';

class QuizResultController {

    static saveQuizResult = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { userId, quizId, quizName, timeTaken, totalQuestions, answeredQuestions, correctAnswers } = req.body;
        const newQuizResult = new QuizResult({ userId, quizId, date: new Date(), quizName, timeTaken, totalQuestions, answeredQuestions, correctAnswers });
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            throw new NotFoundError("Quiz not found");
        }
        // Add the user's ID to the taken array if not already present
        if (!quiz.taken.includes(userId)) {
            quiz.taken.push(userId);
            await quiz.save();
        }
        const savedQuizResult = await newQuizResult.save();
        const response: ApiResponse = {
            status: true,
            message: 'Quiz result saved successfully',
            data: savedQuizResult
        };
        return res.status(201).json(response);
    });

    static getQuizResultsByUserId = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId;
        const quizResults = await QuizResult.find({ userId });
        if (!quizResults || quizResults.length === 0) {
            throw new NotFoundError('No quiz results found for this user');
        }
        const response: ApiResponse = {
            status: true,
            message: 'Quiz results retrieved successfully',
            data: quizResults
        };
        return res.json(response);
    });
}

export default QuizResultController;
