import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";
import { UserRepository } from "@/src/domain/repositories/UserRepository";
import { IdService } from "../services/IdService";
import { LoginMethods } from "../enums/LoginMethods";
import { User } from "@/src/domain/entities/User";
import { CreateTokensUseCase } from "./CreateTokensUseCase";

export class GoogleLoginUseCase {
    private readonly userRepository: UserRepository;
    private readonly loginRepository: LoginRepository;
    private readonly profileRepository: ProfileRepository;
    private readonly idService: IdService;
    private readonly createTokensUseCase: CreateTokensUseCase;

    constructor({
        userRepository,
        loginRepository,
        profileRepository,
        idService,
        createTokensUseCase,
    }: {
        userRepository: UserRepository;
        loginRepository: LoginRepository;
        profileRepository: ProfileRepository;
        idService: IdService;
        createTokensUseCase: CreateTokensUseCase;
    }) {
        this.userRepository = userRepository;
        this.loginRepository = loginRepository;
        this.profileRepository = profileRepository;
        this.idService = idService;
        this.createTokensUseCase = createTokensUseCase;
    }

    async execute({
        email,
        verifiedEmail,
        name,
    }: {
        email: string;
        verifiedEmail: boolean;
        name: string;
    }) {
        const userExists = await this.userRepository.getUserByEmail({ email });

        if (userExists) {
            const googleLogin =
                await this.loginRepository.getGoogleLoginByEmail({ email });

            if (!googleLogin) {
                await this.loginRepository.createLogin({
                    id: this.idService.getUuid(),
                    method: LoginMethods.GOOGLE,
                    userId: userExists.id,
                });
            }

            return await this.createTokensUseCase.execute({
                userId: userExists.id,
                email: userExists.email,
            });
        }

        if (!verifiedEmail) throw new Error("Google email not verified.");

        const user = new User({ id: this.idService.getUuid(), email });

        await this.userRepository.createUser(user);

        await this.profileRepository.createProfile({ userId: user.id, name });

        await this.loginRepository.createLogin({
            id: this.idService.getUuid(),
            method: LoginMethods.GOOGLE,
            userId: user.id,
        });

        return await this.createTokensUseCase.execute({
            userId: user.id,
            email: user.email,
        });
    }
}
