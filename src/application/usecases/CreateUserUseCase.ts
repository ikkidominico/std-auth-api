import User from "@/src/domain/entities/User";
import UserRepository from "@/src/domain/repositories/UserRepository";

export default class CreateUserUseCase {
    userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(user: User) {
        await this.userRepository.createUser(user);
    }
}
