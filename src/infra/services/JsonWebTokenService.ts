import { JwtService, JwtOptions } from "@/src/application/services/JwtService";
import jwt from "jsonwebtoken";

export default class JsonWebTokenService implements JwtService {
    async sign(
        payload: object,
        key: string,
        options: JwtOptions,
    ): Promise<string> {
        return jwt.sign(payload, key, options);
    }

    async verify(token: string, key: string): Promise<object> {
        return jwt.verify(token, key) as object;
    }
}
