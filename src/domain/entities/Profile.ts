import { User } from "./User";

export class Profile {
    name: string;
    birth: Date;
    user: User;

    constructor(name: string, birth: Date, user: User) {
        this.name = name;
        this.birth = birth;
        this.user = user;
    }
}
