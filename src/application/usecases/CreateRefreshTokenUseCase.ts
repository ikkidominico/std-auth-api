import { RefreshTokenRepository } from "@/src/domain/repositories/RefreshTokenRepository";
import { IdService } from "../services/IdService";

export class CreateRefreshTokenUseCase {
    private readonly refreshTokenRepository: RefreshTokenRepository;
    private readonly idService: IdService;

    constructor({
        refreshTokenRepository,
        idService,
    }: {
        refreshTokenRepository: RefreshTokenRepository;
        idService: IdService;
    }) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.idService = idService;
    }

    public async execute({
        userId,
        expiresIn,
    }: {
        userId: string;
        expiresIn: Date;
    }) {
        const refreshTokenExists =
            await this.refreshTokenRepository.getRefreshTokenByUserId({
                userId,
            });

        if (refreshTokenExists) {
            if (new Date(Date.now()) < refreshTokenExists.expiresIn)
                return refreshTokenExists.id;

            await this.refreshTokenRepository.deleteRefreshToken({
                id: refreshTokenExists.id,
            });
        }

        return this.refreshTokenRepository.createRefreshToken({
            id: this.idService.getUuid(),
            expiresIn,
            userId,
        });
    }
}
