import { User } from '../user';
import { UserID } from '../user-id';

export interface IUserGateway {
  findByEmail(email: string): Promise<User | undefined>;
  findById(userId: UserID): Promise<User | undefined>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
}