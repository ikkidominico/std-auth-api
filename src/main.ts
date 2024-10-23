import ExpressAdapter from "./infra/http/express/ExpressAdapter";
import HttpServer from "./infra/http/HttpServer";
import Router from "./infra/http/Router";

function main() {
    const httpServer: HttpServer = new ExpressAdapter();
    const router: Router = new Router(httpServer);
    router.route();
    httpServer.listen(3000);
}

main();
