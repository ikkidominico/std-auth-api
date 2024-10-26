export class User {
    private _id: string;
    private _email: string;

    constructor({ id, email }: { id: string; email: string }) {
        this._id = id;
        this._email = email;
    }

    public get id() {
        return this._id;
    }

    public get email() {
        return this._email;
    }
}
