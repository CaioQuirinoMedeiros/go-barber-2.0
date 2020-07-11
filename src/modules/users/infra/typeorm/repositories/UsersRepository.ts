import { getRepository, Repository, Not } from 'typeorm';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import User from '@modules/users/infra/typeorm/entities/User';

class UsersRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create(createData: ICreateUserDTO): Promise<User> {
    const { email, name, password } = createData;

    const user = this.ormRepository.create({ email, name, password });

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });

    return user;
  }

  public async findAllProviders(data: IFindAllProvidersDTO): Promise<User[]> {
    const users = await this.ormRepository.find({
      where: {
        id: Not(data.except_user_id),
      },
      select: ['id', 'email', 'name', 'created_at', 'updated_at', 'avatar'],
    });

    return users;
  }
}

export default UsersRepository;
