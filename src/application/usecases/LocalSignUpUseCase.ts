import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { User } from "@/src/domain/entities/User";
import { Login } from "@/src/domain/entities/Login";
import { LoginMethods } from "../enums/LoginMethods";
import { CryptService } from "../services/CryptService";
import { UserRepository } from "@/src/domain/repositories/UserRepository";
import { IdService } from "../services/IdService";

export class LocalSignUpUseCase {
    userRepository: UserRepository;
    loginRepository: LoginRepository;
    idService: IdService;
    cryptService: CryptService;

    constructor(
        userRepository: UserRepository,
        loginRepository: LoginRepository,
        idService: IdService,
        cryptService: CryptService,
    ) {
        this.userRepository = userRepository;
        this.loginRepository = loginRepository;
        this.idService = idService;
        this.cryptService = cryptService;
    }

    async execute(email: string, password: string) {
        const userAlreadyExists =
            await this.userRepository.getUserByEmail(email);
        if (userAlreadyExists) throw new Error("User already exists.");

        const user = new User(this.idService.getUuid(), email);

        const login = new Login(
            LoginMethods.LOCAL,
            user,
            await this.cryptService.hash(password),
        );

        try {
            await this.userRepository.createUser(user);
            await this.loginRepository.createLogin(login);
        } catch {
            throw new Error("Failed to save User and/or Login informations.");
        }

        return login;
    }
}
