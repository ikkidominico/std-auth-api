import { User } from "./User";

export class Login {
    id: string;
    method: string;
    password?: string;
    recoveryToken?: string;
    user: User;

    constructor(
        id: string,
        method: string,
        user: User,
        password?: string,
        recoveryToken?: string,
    ) {
        this.id = id;
        this.method = method;
        this.user = user;
        this.password = password;
        this.recoveryToken = recoveryToken;
    }
}
