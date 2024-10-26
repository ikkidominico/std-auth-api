import { User } from "./User";

export class Profile {
    private _name?: string;
    private _birth?: Date;
    private _user: User;

    constructor({ user }: { user: User }) {
        this._user = user;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get name(): string | undefined {
        return this._name;
    }

    public set birth(birth: Date) {
        this._birth = birth;
    }

    public get birth(): Date | undefined {
        return this._birth;
    }

    public get user() {
        return this._user;
    }
}
