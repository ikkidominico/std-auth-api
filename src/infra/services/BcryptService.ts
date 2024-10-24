import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { CryptService } from "@/src/application/services/CryptService";

export class BcryptService implements CryptService {
    async hash(text: string): Promise<string> {
        return bcrypt.hash(text, 12);
    }

    async verify(text: string, hash: string): Promise<boolean> {
        return bcrypt.compare(text, hash);
    }

    async randomToken(): Promise<string> {
        return crypto.randomBytes(48).toString("hex");
    }
}
