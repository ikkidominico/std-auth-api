import { JwtService } from "@/src/application/services/JwtService";
import { NextFunction, Request, Response } from "express";
import JsonWebTokenService from "../../services/JsonWebTokenService";

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

        const result: { email: string } = (await jwtService.verify(
            token,
            "std-auth-api-key",
        )) as { email: string };

        request.user = { email: result.email };

        next();
    } catch (error: unknown) {
        next(error);
    }
}
