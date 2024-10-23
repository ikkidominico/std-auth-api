import User from "./User";

export default class Login {
    user: User;
    method: string;
    password?: string;

    constructor(user: User, method: string, password?: string) {
        this.user = user;
        this.method = method;
        this.password = password;
    }
}
