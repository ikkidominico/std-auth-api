import JwtService from "@/src/application/services/JwtService";
import { NextFunction, Request, Response } from "express";
import JsonWebTokenService from "../../services/JsonWebTokenService";

export async function ExpressJwtMiddleware(
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> {
    const authorization = request.headers["authorization"];
    const token = authorization?.split(" ")[1];
    if (!token) {
        response.status(403).end();
        return;
    }
    const jwtService: JwtService = new JsonWebTokenService();
    try {
        const result: { email: string; iat: number } = (await jwtService.verify(
            token,
            "std-auth-api-key",
        )) as { email: string; iat: number };
        request.user = { email: result.email };
        next();
    } catch (error: unknown) {
        next(error);
    }
}
