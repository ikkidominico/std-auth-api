import { User } from "./User";

export class Login {
    method: string;
    password?: string;
    recoveryToken?: string;
    user: User;

    constructor(
        method: string,
        user: User,
        password?: string,
        recoveryToken?: string,
    ) {
        this.method = method;
        this.user = user;
        this.password = password;
        this.recoveryToken = recoveryToken;
    }
}
