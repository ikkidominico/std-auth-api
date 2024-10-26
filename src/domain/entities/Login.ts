import { User } from "./User";

export class Login {
    private _id: string;
    private _method: string;
    private _password?: string;
    private _recoveryToken?: string;
    private _user: User;

    constructor({
        id,
        method,
        user,
    }: {
        id: string;
        method: string;
        user: User;
    }) {
        this._id = id;
        this._method = method;
        this._user = user;
    }

    public get id() {
        return this._id;
    }

    public get method() {
        return this._method;
    }

    public set password(password: string) {
        this._password = password;
    }

    public get password(): string | undefined {
        return this._password;
    }

    public set recoveryToken(recoveryToken: string) {
        this._recoveryToken = recoveryToken;
    }

    public get recoveryToken(): string | undefined {
        return this._recoveryToken;
    }

    public get user() {
        return this._user;
    }
}
