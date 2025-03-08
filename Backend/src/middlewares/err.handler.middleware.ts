import { Request, Response, NextFunction } from "express";
import { nodeEnv } from "../config";

export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public isOperational: boolean = true,
        public details?: any
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class DatabaseError extends AppError {
    constructor(
        message: string,
        details?: any
    ) {
        super(500, message, true, details);
    }
}

export class ValidationError extends AppError {
    constructor(
        message: string, details?: any) {
        super(400, message, true, details);
    }
}

export class UnauthorisedError extends AppError {
    constructor(message: string = "Unauthorised access") {
        super(401, message);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(404, message);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string) {
        super(401, message);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(409, message);
    }
}

export class JWTError extends AppError {
    constructor(message: string) {
        super(500, message);
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = "Authentication failed") {
        super(401, message);
    }
}

export const globalErrorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: false,
            message: err.message,
            ...(err.details != undefined && { details: err.details }),
            ...(nodeEnv === 'development' && { stack: err.stack })
        });
    }

    return res.status(500).json({
        status: false,
        message: 'Internal Server Error',
        ...(nodeEnv === "development" && { stack: err.stack })
    });
}

export const asyncErrorHandler = (func: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    (req: Request, res: Response, next: NextFunction) => Promise.resolve(func(req, res, next)).catch(next);
}