import User from "./User";

export default class Profile {
    user: User;
    name: string;
    birth: Date;

    constructor(user: User, name: string, birth: Date) {
        this.user = user;
        this.name = name;
        this.birth = birth;
    }
}
