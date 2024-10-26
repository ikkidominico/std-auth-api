import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { User } from "@/src/domain/entities/User";
import { LoginMethods } from "../enums/LoginMethods";
import { CryptService } from "../services/CryptService";
import { UserRepository } from "@/src/domain/repositories/UserRepository";
import { IdService } from "../services/IdService";
import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";

export class LocalSignUpUseCase {
    private readonly userRepository: UserRepository;
    private readonly loginRepository: LoginRepository;
    private readonly profileRepository: ProfileRepository;
    private readonly idService: IdService;
    private readonly cryptService: CryptService;

    constructor({
        userRepository,
        profileRepository,
        loginRepository,
        idService,
        cryptService,
    }: {
        userRepository: UserRepository;
        profileRepository: ProfileRepository;
        loginRepository: LoginRepository;
        idService: IdService;
        cryptService: CryptService;
    }) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.loginRepository = loginRepository;
        this.idService = idService;
        this.cryptService = cryptService;
    }

    async execute({ email, password }: { email: string; password: string }) {
        const userExists = await this.userRepository.getUserByEmail({ email });

        let user;

        if (userExists) {
            const localLoginExists =
                await this.loginRepository.getLocalLoginByEmail({ email });
            if (localLoginExists)
                throw new Error("User local login already exists.");
            user = new User({ id: userExists.id, email: userExists.email });
        } else {
            user = new User({ id: this.idService.getUuid(), email });
            await this.userRepository.createUser(user);
            await this.profileRepository.createProfile({ userId: user.id });
        }

        await this.loginRepository.createLogin({
            id: this.idService.getUuid(),
            method: LoginMethods.LOCAL,
            password: await this.cryptService.hash({ text: password }),
            userId: user.id,
        });
    }
}
