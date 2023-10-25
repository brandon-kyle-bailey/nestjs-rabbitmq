import { RepositoryPort } from 'libs/ports/repository.port';
import { BillingPlanEntity } from '../../../domain/entities/billing-plan.entity';

export interface BillingPlanRepositoryPort
  extends RepositoryPort<BillingPlanEntity> {
  findOneByName(name: string): Promise<BillingPlanEntity>;
}
