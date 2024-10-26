import { UserRepository } from "@/src/domain/repositories/UserRepository";
import {
    GoogleOAuthService,
    GoogleTokensResult,
    GoogleUserResult,
} from "../../services/GoogleOAuthService";
import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";
import { RefreshTokenRepository } from "@/src/domain/repositories/RefreshTokenRepository";
import { IdService } from "@/src/application/services/IdService";
import { CryptService } from "@/src/application/services/CryptService";
import { JwtService } from "@/src/application/services/JwtService";
import { PrismaUserRepository } from "../../repositories/PrismaUserRepository";
import { PrismaLoginRepository } from "../../repositories/PrismaLoginRepository";
import { PrismaProfileRepository } from "../../repositories/PrismaProfileRepository";
import { PrismaRefreshTokenRepository } from "../../repositories/PrismaRefreshTokenRepository";
import { UuidService } from "../../services/UuidService";
import { BcryptService } from "../../services/BcryptService";
import { JsonWebTokenService } from "../../services/JsonWebTokenService";
import { GoogleLoginUseCase } from "@/src/application/usecases/GoogleLoginUseCase";
import { CreateTokensUseCase } from "@/src/application/usecases/CreateTokensUseCase";
import { CreateRefreshTokenUseCase } from "@/src/application/usecases/CreateRefreshTokenUseCase";

export class GoogleOAuthController {
    userRepository: UserRepository = new PrismaUserRepository();
    loginRepository: LoginRepository = new PrismaLoginRepository();
    profileRepository: ProfileRepository = new PrismaProfileRepository();
    refreshTokenRepository: RefreshTokenRepository =
        new PrismaRefreshTokenRepository();
    idService: IdService = new UuidService();
    cryptService: CryptService = new BcryptService();
    jwtService: JwtService = new JsonWebTokenService();
    googleOAuthService: GoogleOAuthService = new GoogleOAuthService();
    createRefreshTokenUseCase: CreateRefreshTokenUseCase =
        new CreateRefreshTokenUseCase({
            refreshTokenRepository: this.refreshTokenRepository,
            idService: this.idService,
        });
    createTokensUseCase: CreateTokensUseCase = new CreateTokensUseCase({
        jwtService: this.jwtService,
        createRefreshTokenUseCase: this.createRefreshTokenUseCase,
    });

    googleLoginUseCase: GoogleLoginUseCase = new GoogleLoginUseCase({
        userRepository: this.userRepository,
        loginRepository: this.loginRepository,
        profileRepository: this.profileRepository,
        idService: this.idService,
        createTokensUseCase: this.createTokensUseCase,
    });

    async handle({ code }: { code: string }) {
        const googleTokensResult: GoogleTokensResult =
            await this.googleOAuthService.getGoogleOAuthTokens(code);
        const googleUserResult: GoogleUserResult =
            await this.googleOAuthService.getGoogleUser(
                googleTokensResult.id_token,
                googleTokensResult.access_token,
            );
        return this.googleLoginUseCase.execute({
            email: googleUserResult.email,
            verifiedEmail: googleUserResult.verified_email,
            name: googleUserResult.name,
        });
    }
}
