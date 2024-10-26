import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { User } from "@/src/domain/entities/User";
import { Login } from "@/src/domain/entities/Login";
import { LoginMethods } from "../enums/LoginMethods";
import { CryptService } from "../services/CryptService";
import { UserRepository } from "@/src/domain/repositories/UserRepository";
import { IdService } from "../services/IdService";
import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";
import { Profile } from "@/src/domain/entities/Profile";

export class LocalSignUpUseCase {
    userRepository: UserRepository;
    profileRepository: ProfileRepository;
    loginRepository: LoginRepository;
    idService: IdService;
    cryptService: CryptService;

    constructor(
        userRepository: UserRepository,
        profileRepository: ProfileRepository,
        loginRepository: LoginRepository,
        idService: IdService,
        cryptService: CryptService,
    ) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.loginRepository = loginRepository;
        this.idService = idService;
        this.cryptService = cryptService;
    }

    async execute(email: string, password: string) {
        const userAlreadyExists =
            await this.userRepository.getUserByEmail(email);
        if (userAlreadyExists) throw new Error("User already exists.");

        const user = new User(this.idService.getUuid(), email);

        const profile = new Profile(user);

        const login = new Login(
            this.idService.getUuid(),
            LoginMethods.LOCAL,
            user,
            await this.cryptService.hash(password),
        );

        try {
            await this.userRepository.createUser(user);
            await this.profileRepository.createProfile(profile);
            await this.loginRepository.createLogin(login);
        } catch {
            throw new Error("Failed to save user informations.");
        }

        return login;
    }
}
