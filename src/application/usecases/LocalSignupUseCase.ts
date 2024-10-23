import LoginRepository from "@/src/domain/repositories/LoginRepository";
import CreateUserUseCase from "./CreateUserUseCase";
import User from "@/src/domain/entities/User";
import Login from "@/src/domain/entities/Login";
import { LoginMethods } from "../enums/LoginMethods";
import CryptService from "../services/CryptService";
import UserRepository from "@/src/domain/repositories/UserRepository";

export default class LocalSignupUseCase {
    userRepository: UserRepository;
    loginRepository: LoginRepository;
    createUserUseCase: CreateUserUseCase;
    cryptService: CryptService;

    constructor(
        userRepository: UserRepository,
        loginRepository: LoginRepository,
        createUserUseCase: CreateUserUseCase,
        cryptService: CryptService,
    ) {
        this.userRepository = userRepository;
        this.loginRepository = loginRepository;
        this.createUserUseCase = createUserUseCase;
        this.cryptService = cryptService;
    }

    async execute(email: string, password: string) {
        const userExists = await this.userRepository.getUserByEmail(email);
        if (userExists) throw new Error("User already exists.");
        const user: User = new User(email);
        const login: Login = new Login(
            user,
            LoginMethods.LOCAL,
            await this.cryptService.hash(password),
        );
        try {
            await this.createUserUseCase.execute(user);
            await this.loginRepository.createLogin(login);
        } catch {
            throw new Error("Failed to save User and/or Login informations.");
        }
        return login;
    }
}
