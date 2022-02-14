import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../../errors/AppError';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';

interface IResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('usersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute(email: string, password: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email or password incorrect.', 401);
    }

    const passwordMatch = compareSync(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Email or password incorrect.', 401);
    }

    const token = sign({}, String(process.env.JWT_SECRET_TOKEN), {
      subject: user.id,
      expiresIn: '5h',
    });

    const tokenResponse: IResponse = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: token,
    };

    return tokenResponse;
  }
}
export { AuthenticateUserUseCase };
