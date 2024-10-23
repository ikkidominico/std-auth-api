import express, { Application, NextFunction, Request, Response } from "express";
import HttpServer from "../HttpServer";
import { HttpMethods } from "../enums/HttpMethodsEnum";

export default class ExpressAdapter implements HttpServer {
    server: Application;

    constructor() {
        this.server = express();
        this.server.use(express.json());
    }

    on(
        method: HttpMethods,
        url: string,
        callback: (request: unknown) => unknown,
        middlewares?: ((
            request: Request,
            response: Response,
            next: NextFunction,
        ) => void)[],
    ): void {
        this.server[method](
            url,
            middlewares ? middlewares : [],
            async (
                request: Request,
                response: Response,
                next: NextFunction,
            ) => {
                try {
                    const output = await callback(request);
                    response.json(output);
                } catch (error: unknown) {
                    next(error);
                }
            },
        );
    }

    listen(port: number): void {
        this.server.listen(port);
    }
}
