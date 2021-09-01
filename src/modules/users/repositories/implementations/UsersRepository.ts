import { getRepository, Repository } from 'typeorm';
import { Game } from '../../../games/entities/Game';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    // Complete usando ORM
    const user = await this.repository.findOneOrFail(user_id, {relations: ["games"]});

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    // Complete usando raw query

    const users = this.repository.query(
      `select *
       from users use
       order by use.first_name`);
    
    return users;
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    // Complete usando raw query
    
    const users = await this.repository.query(
      `select use.id,
              use.first_name,
              use.last_name,
              use.email,
              use.created_at,
              use.updated_at
       from users use
       where lower(use.first_name) = $1
         and lower(use.last_name) = $2`, [first_name.toLowerCase(), last_name.toLowerCase()]);

    return users;
  }
}
