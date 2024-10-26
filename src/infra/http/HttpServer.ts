import { HttpMethods } from "./enums/HttpMethodsEnum";

export interface HttpServer {
    on({
        method,
        url,
        callback,
        middlewares,
    }: {
        method: HttpMethods;
        url: string;
        callback: (request: unknown) => unknown;
        middlewares?: ((...args: never[]) => unknown)[];
    }): void;

    listen({ port }: { port: number }): void;
}
