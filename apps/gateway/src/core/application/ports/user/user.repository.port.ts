import { RepositoryPort } from 'libs/ports/repository.port';
import { UserEntity } from '../../../domain/entities/user.entity';

export interface UserRepositoryPort extends RepositoryPort<UserEntity> {}
