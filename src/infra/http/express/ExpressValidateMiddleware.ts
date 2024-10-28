import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function ExpressValidateMiddleware(schema: z.AnyZodObject) {
    return (request: Request, response: Response, next: NextFunction) => {
        try {
            schema.parse({
                params: request.params,
                query: request.query,
                body: request.body,
            });

            next();
        } catch (error: unknown) {
            next(error);
        }
    };
}
