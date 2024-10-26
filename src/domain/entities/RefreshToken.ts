import { User } from "./User";

export class RefreshToken {
    private _id: string;
    private _expiresIn: Date;
    private _user: User;

    constructor({
        id,
        expiresIn,
        user,
    }: {
        id: string;
        expiresIn: Date;
        user: User;
    }) {
        this._id = id;
        this._expiresIn = expiresIn;
        this._user = user;
    }

    public get id() {
        return this._id;
    }

    public get expiresIn() {
        return this._expiresIn;
    }

    public get user() {
        return this._user;
    }
}
