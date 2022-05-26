import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
    user_id: string;
    avatar_file: string;
}

@injectable()
class UpdateUserAvatarUseCase {
    constructor(
        @inject("UsersRepository")
        private UsersRepository: IUsersRepository
    ) {}

    async execute({user_id, avatar_file }:IRequest): Promise<void> {
        const user = await this.UsersRepository.findById(user_id);

        user.avatar = avatar_file;

        await this.UsersRepository.create(user);
    }
}

export { UpdateUserAvatarUseCase };