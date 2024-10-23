import { HttpMethods } from "./enums/HttpMethodsEnum";

export default interface HttpServer {
    on(
        method: HttpMethods,
        url: string,
        callback: (request: unknown) => unknown,
        middlewares?: ((...args: never[]) => unknown)[],
    ): void;

    listen(port: number): void;
}
