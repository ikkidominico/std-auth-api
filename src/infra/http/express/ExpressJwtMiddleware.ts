import { JwtService } from "@/src/application/services/JwtService";
import { NextFunction, Request, Response } from "express";
import { JsonWebTokenService } from "../../services/JsonWebTokenService";

export async function ExpressJwtMiddleware(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    try {
        const authorization = request.headers["authorization"];

        const token = authorization?.split(" ")[1];

        const jwtService: JwtService = new JsonWebTokenService();

        if (!token) {
            throw new Error("Access token not found.");
        }

        const result: { sub: string; email: string } = (await jwtService.verify(
            {
                token,
                key:
                    (process.env.JWT_KEY as string) ||
                    (process.env.TEST_JWT_KEY as string),
            },
        )) as { sub: string; email: string };

        request.user = { id: result.sub, email: result.email };

        next();
    } catch (error: unknown) {
        next(error);
    }
}
