import { User } from "./User";

export class Profile {
    name?: string;
    birth?: Date;
    user: User;

    constructor(user: User, name?: string, birth?: Date) {
        this.user = user;
        this.name = name;
        this.birth = birth;
    }
}
