import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { User } from "@/src/domain/entities/User";
import { LoginMethods } from "../enums/LoginMethods";
import { CryptService } from "../services/CryptService";
import { UserRepository } from "@/src/domain/repositories/UserRepository";
import { IdService } from "../services/IdService";
import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";

export class LocalSignUpUseCase {
    private readonly userRepository: UserRepository;
    private readonly profileRepository: ProfileRepository;
    private readonly loginRepository: LoginRepository;
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

        if (userExists) throw new Error("User already exists.");

        const user = new User({ id: this.idService.getUuid(), email });

        await this.userRepository.createUser(user);

        await this.profileRepository.createProfile({ userId: user.id });

        await this.loginRepository.createLogin({
            id: this.idService.getUuid(),
            method: LoginMethods.LOCAL,
            password: await this.cryptService.hash({ text: password }),
            userId: user.id,
        });
    }
}
