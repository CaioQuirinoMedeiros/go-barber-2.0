import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  user_id: string;
}

class DeleteUserAvatarService {
  constructor(
    private usersRepository: IUserRepository,
    private storageProvider: IStorageProvider,
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(request: IRequest): Promise<User> {
    const { user_id } = request;

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.avatar) {
      this.storageProvider.deleteFile(user.avatar);
    }

    user.avatar = null;

    await this.usersRepository.save(user);

    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}

export default DeleteUserAvatarService;
