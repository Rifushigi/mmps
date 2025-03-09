import { ObjectSchema, ArraySchema } from "joi";
import { Request, Response, NextFunction } from "express";
import { asyncErrorHandler, ValidationError } from "./err.handler.middleware";
import Joi from "joi";

export const validate = (schema: ObjectSchema | ArraySchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof Joi.ValidationError) {
                next(new ValidationError(error.details[0].message));
            } else {
                next(error);
            }
        }
    }
};