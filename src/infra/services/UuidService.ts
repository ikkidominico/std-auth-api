import { v4 as uuidv4 } from "uuid";
import { IdService } from "@/src/application/services/IdService";

export class UuidService implements IdService {
    getUuid(): string {
        return uuidv4();
    }
}
