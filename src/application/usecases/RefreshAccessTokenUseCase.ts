import { RefreshTokenRepository } from "@/src/domain/repositories/RefreshTokenRepository";
import { UserRepository } from "@/src/domain/repositories/UserRepository";
import { JwtService } from "../services/JwtService";

export class RefreshAccessTokenUseCase {
    private readonly refreshTokenRepository: RefreshTokenRepository;
    private readonly userRepository: UserRepository;
    private readonly jwtService: JwtService;

    constructor({
        refreshTokenRepository,
        userRepository,
        jwtService,
    }: {
        refreshTokenRepository: RefreshTokenRepository;
        userRepository: UserRepository;
        jwtService: JwtService;
    }) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    async execute({ refreshTokenId }: { refreshTokenId: string }) {
        const refreshTokenExists =
            await this.refreshTokenRepository.getRefreshTokenById({
                id: refreshTokenId,
            });

        if (!refreshTokenExists) throw new Error("Refresh token not found.");

        if (new Date(Date.now()) > refreshTokenExists.expiresIn)
            throw new Error("Refresh token is expired.");

        const userExists = await this.userRepository.getUserById({
            id: refreshTokenExists.user.id,
        });

        if (!userExists) throw new Error("User not found.");

        const accessToken = await this.jwtService.sign({
            payload: {
                sub: userExists.id,
                email: userExists.email,
            },
            key:
                (process.env.JWT_KEY as string) ||
                (process.env.TEST_JWT_KEY as string),
            options: { expiresIn: "30m" },
        });

        return {
            access_token: accessToken,
        };
    }
}
