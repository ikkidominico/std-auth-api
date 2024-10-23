import UserRepository from "@/src/domain/repositories/UserRepository";

export default class GetUserUseCase {
    userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(id: string) {
        return await this.userRepository.getUserById(id);
    }
}
