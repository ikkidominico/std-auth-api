import { LoginMethods } from "@/src/application/enums/LoginMethods";
import { Login } from "@/src/domain/entities/Login";
import { LoginRepository } from "@/src/domain/repositories/LoginRepository";

export class InMemoryLoginRepository implements LoginRepository {
    logins: Login[];

    constructor() {
        this.logins = [];
    }

    async createLogin(login: Login): Promise<void> {
        this.logins.push(login);
    }

    async getLocalLoginByEmail(email: string): Promise<Login | null> {
        const login = this.logins.find(
            (login) =>
                login.method === LoginMethods.LOCAL &&
                login.user.email === email,
        );
        if (!login) throw new Error();
        return login;
    }

    async getLocalLoginByRecoveryToken(
        recoveryToken: string,
    ): Promise<Login | null> {
        const login = this.logins.find(
            (login) =>
                login.method === LoginMethods.LOCAL &&
                login.recoveryToken === recoveryToken,
        );
        if (!login) throw new Error();
        return login;
    }

    async updateRecoveryTokenByUserId(
        userId: string,
        recoveryToken: string,
    ): Promise<Login | null> {
        const index = this.logins.findIndex(
            (login) => (login.user.id = userId),
        );
        this.logins[index].recoveryToken = recoveryToken;
        return this.logins[index];
    }

    async updatePasswordByUserId(
        userId: string,
        password: string,
    ): Promise<Login | null> {
        const index = this.logins.findIndex(
            (login) => (login.user.id = userId),
        );
        this.logins[index].password = password;
        return this.logins[index];
    }
}
