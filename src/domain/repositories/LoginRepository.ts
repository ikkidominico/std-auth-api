import Login from "../entities/Login";

export default interface LoginRepository {
    createLogin(login: Login): Promise<void>;
    getLocalLoginByEmail(email: string): Promise<Login | null>;
}
