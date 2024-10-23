import CryptService from "@/src/application/services/CryptService";
import bcrypt from "bcrypt";

export default class BcryptService implements CryptService {
    async hash(text: string): Promise<string> {
        return bcrypt.hash(text, 12);
    }
    async verify(text: string, hash: string): Promise<boolean> {
        return bcrypt.compare(text, hash);
    }
}
