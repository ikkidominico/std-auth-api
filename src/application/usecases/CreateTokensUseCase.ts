import { JwtService } from "../services/JwtService";
import { CreateRefreshTokenUseCase } from "./CreateRefreshTokenUseCase";

export class CreateTokensUseCase {
    private readonly jwtService: JwtService;
    private readonly createRefreshTokenUseCase: CreateRefreshTokenUseCase;

    constructor({
        jwtService,
        createRefreshTokenUseCase,
    }: {
        jwtService: JwtService;
        createRefreshTokenUseCase: CreateRefreshTokenUseCase;
    }) {
        this.jwtService = jwtService;
        this.createRefreshTokenUseCase = createRefreshTokenUseCase;
    }

    public async execute({ userId, email }: { userId: string; email: string }) {
        const accessToken = await this.jwtService.sign({
            payload: {
                sub: userId,
                email: email,
            },
            key:
                (process.env.JWT_KEY as string) ||
                (process.env.TEST_JWT_KEY as string),
            options: { expiresIn: "30m" },
        });

        const refreshToken = await this.createRefreshTokenUseCase.execute({
            userId,
            expiresIn: new Date(new Date().setHours(new Date().getHours() + 2)),
        });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }
}
