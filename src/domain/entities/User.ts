import IdService from "../services/IdService";

export default class User {
    id: string;
    email: string;

    constructor(email: string, id?: string) {
        this.id = id || IdService.uuid();
        this.email = email;
    }
}
