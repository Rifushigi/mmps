import mongoose, { Model, ObjectId } from "mongoose";
import { Request } from 'express';


/**
 * Interface for the Quiz
 */
export interface IQuiz {
    id?: string;
    name?: string;
    questions?: Question[];
    duration?: number;
    dateCreated?: Date;
    taken?: mongoose.Types.ObjectId[];
}

/**
 * Interface for the question that will 
 * be used in the quiz section
 */
interface Question {
    id: number;
    text: string;
    options: Option[];
}

/**
 * Interface for the options for the quiz
 */
interface Option {
    id: number;
    label?: string;
    text: string;
    isCorrect: boolean;
}

/**
 * Extends Request to allow additional user properties
 */
export interface RequestWithUser extends Request {
    user?: IUser; // Or a simplified version of IUser with the properties you need
}

/**
 * defines the user fields
 */
export interface IUser {
    _id?: ObjectId;
    id?: string;
    name?: string;
    email?: string;
    hash?: string;
    refreshToken?: string;
    accessToken?: string;
    isAdmin?: boolean;
    faceDescriptors?: Array<Array<number>>;
}

/**
 * Extends the User interface
 */
export interface IUserDocument extends IUser, Document {
    // Add any instance methods here if needed
}

/**
 * Extends the user model to allow static login method usage.
 */
export interface IUserModel extends Model<IUserDocument> {
    login(email: string, password: string): Promise<IUserDocument>;
}

/**
 * Defines the api response structure
 */
export interface ApiResponse {
    status: boolean;
    message: string;
    data?: any;
}