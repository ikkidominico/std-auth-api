import LoginRepository from "@/src/domain/repositories/LoginRepository";
import CryptService from "../services/CryptService";
import JwtService from "../services/JwtService";
import CreateRefreshTokenUseCase from "./CreateRefreshTokenUseCase";

type Input = {
    email: string;
    password: string;
};

type Output = {
    access_token: string;
    refresh_token: string;
};

export default class LocalLoginUseCase {
    loginRepository: LoginRepository;
    cryptService: CryptService;
    jwtService: JwtService;
    createRefreshTokenUseCase: CreateRefreshTokenUseCase;

    constructor(
        loginRepository: LoginRepository,
        cryptService: CryptService,
        jwtService: JwtService,
        createRefreshTokenUseCase: CreateRefreshTokenUseCase,
    ) {
        this.loginRepository = loginRepository;
        this.cryptService = cryptService;
        this.jwtService = jwtService;
        this.createRefreshTokenUseCase = createRefreshTokenUseCase;
    }

    async execute(input: Input): Promise<Output> {
        const login = await this.loginRepository.getLocalLoginByEmail(
            input.email,
        );
        if (!login) throw new Error("Login information not found.");
        const result = await this.cryptService.verify(
            input.password,
            login.password as string,
        );
        if (!result) {
            throw new Error("Invalid email and/or password");
        }
        return {
            access_token: await this.jwtService.sign(
                { sub: login.user.id, email: login.user.email },
                "std-auth-api-key",
                { expiresIn: "30m" },
            ),
            refresh_token: await this.createRefreshTokenUseCase.execute(
                login.user.id,
                new Date(new Date().setHours(new Date().getHours() + 2)),
            ),
        };
    }
}
