import User from "./User";

export default class RefreshToken {
    user: User;
    id: string;
    expiresIn: Date;

    constructor(user: User, id: string, expiresIn: Date) {
        this.user = user;
        this.id = id;
        this.expiresIn = expiresIn;
    }
}
