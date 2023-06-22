import { User } from '../user';

export interface IUserGateway {
  findByEmail(email: string): Promise<User | undefined>;
  create(user: User): Promise<User>;
}