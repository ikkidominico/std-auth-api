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
}
