import { GetLoginsController } from "./controllers/GetLoginsController";
import { GetProfileController } from "./controllers/GetProfileController";
import { HomeController } from "./controllers/HomeController";
import { LoginController } from "./controllers/LoginController";
import { PasswordRecoveryController } from "./controllers/PasswordRecoveryController";
import { RefreshAccessTokenController } from "./controllers/RefreshAccessTokenController";
import { ResetPasswordController } from "./controllers/ResetPasswordController";
import { SignUpController } from "./controllers/SignUpController";
import { UpdateProfileController } from "./controllers/UpdateProfileController";
import { HttpMethods } from "./enums/HttpMethodsEnum";
import { ExpressJwtMiddleware } from "./express/ExpressJwtMiddleware";
import { HttpServer } from "./HttpServer";

export class Router {
    httpServer: HttpServer;

    constructor(httpServer: HttpServer) {
        this.httpServer = httpServer;
    }

    async route() {
        this.httpServer.on(HttpMethods.POST, "/signup", (request) => {
            const { body } = request as {
                body: {
                    email: string;
                    password: string;
                };
            };
            const { email, password } = body;
            const signUpController: SignUpController = new SignUpController();
            return signUpController.handle(email, password);
        });

        this.httpServer.on(HttpMethods.POST, "/login", (request) => {
            const { body } = request as {
                body: {
                    email: string;
                    password: string;
                };
            };
            const { email, password } = body;
            const loginController: LoginController = new LoginController();
            return loginController.handle(email, password);
        });

        this.httpServer.on(
            HttpMethods.GET,
            "/refresh/:refreshToken",
            (request) => {
                const { params } = request as {
                    params: { refreshToken: string };
                };
                const refreshToken = params.refreshToken;
                const refreshTokenController: RefreshAccessTokenController =
                    new RefreshAccessTokenController();
                return refreshTokenController.handle(refreshToken);
            },
        );

        this.httpServer.on(HttpMethods.POST, "/forgot", (request) => {
            const { body } = request as {
                body: {
                    email: string;
                };
            };
            const { email } = body;
            const passwordRecoveryController: PasswordRecoveryController =
                new PasswordRecoveryController();
            return passwordRecoveryController.handle(email);
        });

        this.httpServer.on(
            HttpMethods.POST,
            "/reset/:recoveryToken",
            (request) => {
                const { params } = request as {
                    params: { recoveryToken: string };
                };
                const { body } = request as {
                    body: {
                        password: string;
                    };
                };
                const resetPasswordController: ResetPasswordController =
                    new ResetPasswordController();
                return resetPasswordController.handle(
                    params.recoveryToken,
                    body.password,
                );
            },
        );

        this.httpServer.on(
            HttpMethods.GET,
            "/home",
            () => {
                const homeController: HomeController = new HomeController();
                return homeController.handle();
            },
            [ExpressJwtMiddleware],
        );

        this.httpServer.on(
            HttpMethods.GET,
            "/profiles",
            (request) => {
                const { user } = request as {
                    user: {
                        id: string;
                        email: string;
                    };
                };
                const getProfileController: GetProfileController =
                    new GetProfileController();
                return getProfileController.handle(user.id);
            },
            [ExpressJwtMiddleware],
        );

        this.httpServer.on(
            HttpMethods.PUT,
            "/profiles",
            (request) => {
                const { user } = request as {
                    user: {
                        id: string;
                        email: string;
                    };
                };
                const { body } = request as {
                    body: {
                        name?: string;
                        birth?: string;
                    };
                };
                const updateProfileController: UpdateProfileController =
                    new UpdateProfileController();
                let parsedBirth = undefined;
                if (body.birth) {
                    parsedBirth = new Date(body.birth);
                }
                return updateProfileController.handle(
                    user.id,
                    body.name,
                    parsedBirth,
                );
            },
            [ExpressJwtMiddleware],
        );

        this.httpServer.on(
            HttpMethods.GET,
            "/logins",
            (request) => {
                const { user } = request as {
                    user: {
                        id: string;
                        email: string;
                    };
                };
                const getLoginsController: GetLoginsController =
                    new GetLoginsController();
                return getLoginsController.handle(user.id);
            },
            [ExpressJwtMiddleware],
        );
    }
}
