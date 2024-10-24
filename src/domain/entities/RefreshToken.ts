import { User } from "./User";

export class RefreshToken {
    id: string;
    expiresIn: Date;
    user: User;

    constructor(id: string, expiresIn: Date, user: User) {
        this.id = id;
        this.expiresIn = expiresIn;
        this.user = user;
    }
}
