import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";
import { UserRepository } from "@/src/domain/repositories/UserRepository";
import { IdService } from "../services/IdService";
import { CryptService } from "../services/CryptService";
import { JwtService } from "../services/JwtService";
import { RefreshTokenRepository } from "@/src/domain/repositories/RefreshTokenRepository";
import { Login } from "@/src/domain/entities/Login";
import { LoginMethods } from "../enums/LoginMethods";
import { User } from "@/src/domain/entities/User";
import { Profile } from "@/src/domain/entities/Profile";

export class GoogleLoginUseCase {
    userRepository: UserRepository;
    loginRepository: LoginRepository;
    profileRepository: ProfileRepository;
    refreshTokenRepository: RefreshTokenRepository;
    idService: IdService;
    cryptService: CryptService;
    jwtService: JwtService;

    constructor(
        userRepository: UserRepository,
        loginRepository: LoginRepository,
        profileRepository: ProfileRepository,
        refreshTokenRepository: RefreshTokenRepository,
        idService: IdService,
        cryptService: CryptService,
        jwtService: JwtService,
    ) {
        this.userRepository = userRepository;
        this.loginRepository = loginRepository;
        this.profileRepository = profileRepository;
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

    async execute({
        email,
        verified_email,
        name,
    }: {
        email: string;
        verified_email: boolean;
        name: string;
    }) {
        const user = await this.userRepository.getUserByEmail(email);

        if (user) {
            let login: Login;

            const googleLogin =
                await this.loginRepository.getGoogleLoginByEmail(email);

            if (!googleLogin) {
                login = new Login(
                    this.idService.getUuid(),
                    LoginMethods.GOOGLE,
                    user,
                );
                await this.loginRepository.createLogin(login);
            }

            login = googleLogin as Login;

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

        if (!verified_email) throw new Error("Google email not verified.");

        const newUser = new User(this.idService.getUuid(), email);
        const profile = new Profile(newUser, name);
        const login = new Login(
            this.idService.getUuid(),
            LoginMethods.GOOGLE,
            newUser,
        );

        try {
            await this.userRepository.createUser(newUser);
            await this.profileRepository.createProfile(profile);
            await this.loginRepository.createLogin(login);
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
        } catch {
            throw new Error("Failed to save user informations.");
        }
    }
}
