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

    googleLoginUseCase: GoogleLoginUseCase = new GoogleLoginUseCase(
        this.userRepository,
        this.loginRepository,
        this.profileRepository,
        this.refreshTokenRepository,
        this.idService,
        this.cryptService,
        this.jwtService,
    );

    async handle(code: string) {
        const googleTokensResult: GoogleTokensResult =
            await this.googleOAuthService.getGoogleOAuthTokens(code);
        const googleUserResult: GoogleUserResult =
            await this.googleOAuthService.getGoogleUser(
                googleTokensResult.id_token,
                googleTokensResult.access_token,
            );
        return this.googleLoginUseCase.execute({
            email: googleUserResult.email,
            verified_email: googleUserResult.verified_email,
            name: googleUserResult.name,
        });
    }
}
