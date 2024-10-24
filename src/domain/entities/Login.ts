import { User } from "./User";

export class Login {
    method: string;
    password?: string;
    user: User;

    constructor(method: string, user: User, password?: string) {
        this.method = method;
        this.user = user;
        this.password = password;
    }
}
