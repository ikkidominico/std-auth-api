import express, { Application, NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import { HttpServer } from "../HttpServer";
import { HttpMethods } from "../enums/HttpMethodsEnum";

export class ExpressAdapter implements HttpServer {
    private readonly server: Application;

    constructor() {
        this.server = express();
        this.server.use(
            "/docs",
            swaggerUi.serve,
            swaggerUi.setup(swaggerDocument, {
                customSiteTitle: "Documentation",
                customCss: ".swagger-ui .topbar { display: none }",
            }),
        );
        this.server.use(express.json());
    }

    on({
        method,
        url,
        callback,
        middlewares,
    }: {
        method: HttpMethods;
        url: string;
        callback: (request: unknown) => unknown;
        middlewares?: ((
            request: Request,
            response: Response,
            next: NextFunction,
        ) => void)[];
    }): void {
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

    listen({ port }: { port: number }): void {
        this.server.listen(port);
    }
}
