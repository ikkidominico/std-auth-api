import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { CryptService } from "../services/CryptService";
import { JwtService } from "../services/JwtService";
import { RefreshTokenRepository } from "@/src/domain/repositories/RefreshTokenRepository";
import { IdService } from "../services/IdService";

type Input = {
    email: string;
    password: string;
};

type Output = {
    access_token: string;
    refresh_token: string;
};

export class LocalLoginUseCase {
    loginRepository: LoginRepository;
    refreshTokenRepository: RefreshTokenRepository;
    idService: IdService;
    cryptService: CryptService;
    jwtService: JwtService;

    constructor(
        loginRepository: LoginRepository,
        refreshTokenRepository: RefreshTokenRepository,
        idService: IdService,
        cryptService: CryptService,
        jwtService: JwtService,
    ) {
        this.loginRepository = loginRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.idService = idService;
        this.cryptService = cryptService;
        this.jwtService = jwtService;
    }

    async createRefreshToken(userId: string, expiresIn: Date): Promise<string> {
        const refreshToken =
            await this.refreshTokenRepository.getRefreshTokenByUserId(userId);

        if (refreshToken) {
            if (refreshToken.expiresIn < new Date(Date.now())) {
                const id = this.idService.getUuid();
                await this.refreshTokenRepository.updateRefreshTokenByUserId(
                    id,
                    userId,
                    new Date(new Date().setHours(new Date().getHours() + 2)),
                );
                return id;
            }
            return refreshToken.id;
        }

        return this.refreshTokenRepository.createRefreshToken(
            this.idService.getUuid(),
            expiresIn,
            userId,
        );
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

        const access_token = await this.jwtService.sign(
            { sub: login.user.id, email: login.user.email },
            (process.env.JWT_KEY as string) ||
                (process.env.TEST_JWT_KEY as string),
            { expiresIn: "30m" },
        );

        const refresh_token = await this.createRefreshToken(
            login.user.id,
            new Date(new Date().setHours(new Date().getHours() + 2)),
        );

        return {
            access_token,
            refresh_token,
        };
    }
}
