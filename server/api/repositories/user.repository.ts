import { IUser, User } from '../models/user.model';
import { Repository } from './repository';

export class UserRepository extends Repository<IUser> {
  constructor() {
    super();
    this.model = User;
  }
}
