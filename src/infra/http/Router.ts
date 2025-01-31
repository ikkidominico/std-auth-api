import { LoginMethods } from "@/src/application/enums/LoginMethods";
import { DeleteLoginController } from "./controllers/DeleteLoginController";
import { GetLoginsController } from "./controllers/GetLoginsController";
import { GetProfileController } from "./controllers/GetProfileController";
import { GoogleOAuthController } from "./controllers/GoogleOAuthController";
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
import { ExpressValidateMiddleware } from "./express/ExpressValidateMiddleware";
import { signupSchema } from "./schemas/signupSchema";
import { loginSchema } from "./schemas/loginSchema";
import { refreshSchema } from "./schemas/refreshSchema";
import { forgotSchema } from "./schemas/forgotSchema";
import { resetSchema } from "./schemas/resetSchema";
import { profileSchema } from "./schemas/profileSchema";
import { deleteLoginSchema } from "./schemas/deleteLoginSchema";

export class Router {
    private readonly httpServer: HttpServer;

    constructor({ httpServer }: { httpServer: HttpServer }) {
        this.httpServer = httpServer;
    }

    async route() {
        this.httpServer.on({
            method: HttpMethods.POST,
            url: "/signup",
            callback: (request) => {
                const { body } = request as {
                    body: {
                        email: string;
                        password: string;
                    };
                };
                const { email, password } = body;
                const signUpController: SignUpController =
                    new SignUpController();
                return signUpController.handle({ email, password });
            },
            middlewares: [ExpressValidateMiddleware(signupSchema)],
        });

        this.httpServer.on({
            method: HttpMethods.POST,
            url: "/login",
            callback: (request) => {
                const { body } = request as {
                    body: {
                        email: string;
                        password: string;
                    };
                };
                const { email, password } = body;
                const loginController: LoginController = new LoginController();
                return loginController.handle({ email, password });
            },
            middlewares: [ExpressValidateMiddleware(loginSchema)],
        });

        this.httpServer.on({
            method: HttpMethods.GET,
            url: "/auth/google",
            callback: (request) => {
                const { query } = request as {
                    query: {
                        code: string;
                    };
                };
                const googleOAuthController: GoogleOAuthController =
                    new GoogleOAuthController();
                return googleOAuthController.handle({ code: query.code });
            },
        });

        this.httpServer.on({
            method: HttpMethods.GET,
            url: "/refresh/:refreshToken",
            callback: (request) => {
                const { params } = request as {
                    params: { refreshToken: string };
                };
                const refreshToken = params.refreshToken;
                const refreshTokenController: RefreshAccessTokenController =
                    new RefreshAccessTokenController();
                return refreshTokenController.handle({ refreshToken });
            },
            middlewares: [ExpressValidateMiddleware(refreshSchema)],
        });

        this.httpServer.on({
            method: HttpMethods.POST,
            url: "/forgot",
            callback: (request) => {
                const { body } = request as {
                    body: {
                        email: string;
                    };
                };
                const { email } = body;
                const passwordRecoveryController: PasswordRecoveryController =
                    new PasswordRecoveryController();
                return passwordRecoveryController.handle({ email });
            },
            middlewares: [ExpressValidateMiddleware(forgotSchema)],
        });

        this.httpServer.on({
            method: HttpMethods.POST,
            url: "/reset/:recoveryToken",
            callback: (request) => {
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
                return resetPasswordController.handle({
                    recoveryToken: params.recoveryToken,
                    password: body.password,
                });
            },
            middlewares: [ExpressValidateMiddleware(resetSchema)],
        });

        this.httpServer.on({
            method: HttpMethods.GET,
            url: "/home",
            callback: () => {
                const homeController: HomeController = new HomeController();
                return homeController.handle();
            },
            middlewares: [ExpressJwtMiddleware],
        });

        this.httpServer.on({
            method: HttpMethods.GET,
            url: "/profiles",
            callback: (request) => {
                const { user } = request as {
                    user: {
                        id: string;
                        email: string;
                    };
                };
                const getProfileController: GetProfileController =
                    new GetProfileController();
                return getProfileController.handle({ userId: user.id });
            },
            middlewares: [ExpressJwtMiddleware],
        });

        this.httpServer.on({
            method: HttpMethods.PUT,
            url: "/profiles",
            callback: (request) => {
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
                return updateProfileController.handle({
                    name: body.name,
                    birth: parsedBirth,
                    userId: user.id,
                });
            },
            middlewares: [
                ExpressJwtMiddleware,
                ExpressValidateMiddleware(profileSchema),
            ],
        });

        this.httpServer.on({
            method: HttpMethods.GET,
            url: "/logins",
            callback: (request) => {
                const { user } = request as {
                    user: {
                        id: string;
                        email: string;
                    };
                };
                const getLoginsController: GetLoginsController =
                    new GetLoginsController();
                return getLoginsController.handle({ userId: user.id });
            },
            middlewares: [ExpressJwtMiddleware],
        });

        this.httpServer.on({
            method: HttpMethods.DELETE,
            url: "/logins",
            callback: (request) => {
                const { user } = request as {
                    user: {
                        id: string;
                        email: string;
                    };
                };
                const { body } = request as {
                    body: {
                        method: string;
                    };
                };
                const deleteLoginController: DeleteLoginController =
                    new DeleteLoginController();
                console.log(body.method as keyof typeof LoginMethods);
                return deleteLoginController.handle({
                    userId: user.id,
                    method: body.method,
                });
            },
            middlewares: [
                ExpressJwtMiddleware,
                ExpressValidateMiddleware(deleteLoginSchema),
            ],
        });
    }
}
