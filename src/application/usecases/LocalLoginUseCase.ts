import LoginRepository from "@/src/domain/repositories/LoginRepository";
import CryptService from "../services/CryptService";
import JwtService from "../services/JwtService";

export default class LocalLoginUseCase {
    loginRepository: LoginRepository;
    cryptService: CryptService;
    jwtService: JwtService;

    constructor(
        loginRepository: LoginRepository,
        cryptService: CryptService,
        jwtService: JwtService,
    ) {
        this.loginRepository = loginRepository;
        this.cryptService = cryptService;
        this.jwtService = jwtService;
    }

    async execute(email: string, password: string): Promise<string> {
        const login = await this.loginRepository.getLocalLoginByEmail(email);
        if (!login) throw new Error("Login information not found.");
        const result = await this.cryptService.verify(
            password,
            login.password as string,
        );
        if (!result) {
            throw new Error("Invalid email and/or password");
        }
        return this.jwtService.sign(
            { email: login.user.email },
            "std-auth-api-key",
        );
    }
}
