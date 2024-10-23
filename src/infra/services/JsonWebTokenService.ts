import JwtService from "@/src/application/services/JwtService";
import jwt from "jsonwebtoken";

export default class JsonWebTokenService implements JwtService {
    async sign(payload: object, key: string): Promise<string> {
        return jwt.sign(payload, key);
    }
    async verify(token: string, key: string): Promise<object> {
        const payload = jwt.verify(token, key);
        return payload as object;
    }
}
