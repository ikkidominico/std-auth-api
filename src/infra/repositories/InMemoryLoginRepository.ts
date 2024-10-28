import { LoginMethods } from "@/src/application/enums/LoginMethods";
import { Login } from "@/src/domain/entities/Login";
import { User } from "@/src/domain/entities/User";
import { LoginRepository } from "@/src/domain/repositories/LoginRepository";

export class InMemoryLoginRepository implements LoginRepository {
    logins: Login[];

    constructor() {
        this.logins = [];
    }

    async createLogin({
        id,
        method,
        password,
        userId,
    }: {
        id: string;
        method: string;
        password?: string;
        userId: string;
    }): Promise<void> {
        const user = new User({ id: userId, email: "johndoe@email.com" });
        const login = new Login({ id, method, user });
        login.password = password!;
        this.logins.push(login);
    }

    async getLoginsByUserId({ userId }: { userId: string }): Promise<Login[]> {
        return this.logins.filter((login) => login.user.id === userId);
    }

    async getLocalLoginByEmail({
        email,
    }: {
        email: string;
    }): Promise<Login | undefined> {
        const login = this.logins.find(
            (login) =>
                login.method === LoginMethods.LOCAL &&
                login.user.email === email,
        );
        if (!login) throw new Error("Login not found.");
        return login;
    }

    async getGoogleLoginByEmail({
        email,
    }: {
        email: string;
    }): Promise<Login | undefined> {
        const login = this.logins.find(
            (login) =>
                login.method === LoginMethods.GOOGLE &&
                login.user.email === email,
        );
        if (!login) throw new Error("Login not found.");
        return login;
    }

    async getLocalLoginByRecoveryToken({
        recoveryToken,
    }: {
        recoveryToken: string;
    }): Promise<Login | undefined> {
        const login = this.logins.find(
            (login) =>
                login.method === LoginMethods.LOCAL &&
                login.recoveryToken === recoveryToken,
        );
        if (!login) throw new Error("Login not found.");
        return login;
    }

    async updateLoginByUserId({
        password,
        recoveryToken,
        userId,
    }: {
        password?: string;
        recoveryToken?: string;
        userId: string;
    }): Promise<Login | undefined> {
        const index = this.logins.findIndex(
            (login) => login.user.id === userId,
        );
        if (password) this.logins[index].password = password;
        if (recoveryToken) this.logins[index].recoveryToken = recoveryToken;
        return this.logins[index];
    }

    async deleteLoginById({ id }: { id: string }): Promise<void> {
        const logins = this.logins.filter((login) => login.id !== id);
        this.logins = logins;
    }
}
