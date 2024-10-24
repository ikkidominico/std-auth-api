import { Login } from "../entities/Login";

export interface LoginRepository {
    createLogin(login: Login): Promise<void>;

    getLocalLoginByEmail(email: string): Promise<Login | null>;

    getLocalLoginByRecoveryToken(recoveryToken: string): Promise<Login | null>;

    updateRecoveryTokenByUserId(
        userId: string,
        recoveryToken: string,
    ): Promise<Login | null>;

    updatePasswordByUserId(
        userId: string,
        password: string,
    ): Promise<Login | null>;
}
