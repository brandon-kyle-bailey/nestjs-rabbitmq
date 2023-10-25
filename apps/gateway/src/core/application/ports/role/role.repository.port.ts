import { RepositoryPort } from 'libs/ports/repository.port';
import { RoleEntity } from '../../../domain/entities/role.entity';

export interface RoleRepositoryPort extends RepositoryPort<RoleEntity> {
  findOneByName(name: string): Promise<RoleEntity>;
}
