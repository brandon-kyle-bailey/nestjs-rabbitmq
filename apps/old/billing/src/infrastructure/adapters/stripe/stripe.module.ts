import { Module } from '@nestjs/common';
import { adapters } from './stripe.adapters';

@Module({
  imports: [],
  providers: [...adapters],
  exports: [...adapters],
})
export class StripeModule {}
