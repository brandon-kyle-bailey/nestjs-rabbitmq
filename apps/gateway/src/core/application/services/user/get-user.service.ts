import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from 'apps/gateway/src/interface/queries/user/get-user.query';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';

@QueryHandler(GetUserQuery)
export class GetUserService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(UserRepository)
    protected readonly repo: UserRepositoryPort,
  ) {}
  async execute(query: GetUserQuery): Promise<UserEntity> {
    try {
      return await this.repo.findOneById(query.id);
    } catch (error) {
      this.logger.error('GetUserService.execute encountered an error', error);
    }
  }
}
