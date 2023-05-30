import { classToClass } from 'class-transformer';

import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  user_id: string;
}

class ListProvidersService {
  constructor(
    private usersRepository: IUserRepository,
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(request: IRequest): Promise<User[]> {
    const { user_id } = request;

    const cacheKey = `providers-list:${user_id}`;

    let users = await this.cacheProvider.recover<User[]>(cacheKey);

    if (!users) {
      users = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });

      await this.cacheProvider.save(cacheKey, classToClass(users));
    }

    return users;
  }
}

export default ListProvidersService;
