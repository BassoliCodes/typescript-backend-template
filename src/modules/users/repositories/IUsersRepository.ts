import { User } from '@prisma/client';
import { ICreateUsersDTO } from '../dtos/ICreateUsersDTO';

interface IUsersRepository {
  create({ name, email, password }: ICreateUsersDTO): Promise<User>;
}

export { IUsersRepository };
