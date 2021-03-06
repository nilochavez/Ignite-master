import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AppError } from "../../../../errors/AppError";
//import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";


interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
  //refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
    
   ){}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    
    if (!user) {
      throw new AppError("Email or password incorrect!");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Email or password incorrect!");
    }

    const token = sign({}, 'b4a9ad0d41433925b4320749fb22ddec', {
      subject: user.id,
      expiresIn: "1d"
    });

    



    const tokenReturn: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email
      }
    };

    return tokenReturn;
  }
}

export { AuthenticateUserUseCase };
