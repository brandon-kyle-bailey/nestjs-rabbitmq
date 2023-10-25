import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from 'apps/gateway/src/interface/commands/user/create-user.command';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';
import { RoleRepository } from '../../ports/role/role.repository';
import { RoleRepositoryPort } from '../../ports/role/role.repository.port';
import { BillingPlanRepository } from '../../ports/billing-plan/billing-plan.repository';
import { BillingPlanRepositoryPort } from '../../ports/billing-plan/billing-plan.repository.port';
import { v4 } from 'uuid';
import { ArgumentInvalidException } from 'libs/exceptions/exceptions';

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(UserRepository)
    protected readonly repo: UserRepositoryPort,
    @Inject(RoleRepository)
    protected readonly roleRepo: RoleRepositoryPort,
    @Inject(BillingPlanRepository)
    protected readonly billingPlanRepo: BillingPlanRepositoryPort,
  ) {}
  async execute(command: CreateUserCommand): Promise<UserEntity> {
    try {
      const existingUser = await this.repo.findOneByEmail(command.email);
      if (existingUser) {
        throw new ArgumentInvalidException('user already exists');
      }
      const role = await this.roleRepo.findOneByName(command.role);
      const billingPlan = await this.billingPlanRepo.findOneByName(
        command.billingPlanName,
      );
      const user = UserEntity.create({
        name: command.name,
        billingCustomerId: v4(),
        email: command.email,
        password: command.password,
        billingPlan,
        roleId: role.id,
        billingPlanId: billingPlan.id,
        role,
        verified: false,
      });
      await this.repo.transaction(async () => {
        this.repo.insert(user);
      });
      return user;
    } catch (error) {
      this.logger.error(
        'CreateUserService.execute encountered an error',
        error,
      );
    }
  }
}
