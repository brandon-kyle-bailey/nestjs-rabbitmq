import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePaymentIntentRequestDto } from '../../dtos/billing/create-payment-intent.request.dto';
import { PaymentIntentResponseDto } from '../../dtos/billing/payment-intent.response.dto';
import { CreatePaymentIntentCommand } from '../../commands/billing/create-payment-intent.command';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';
import { PaymentIntentMapper } from 'apps/gateway/src/infrastructure/mappers/payment-intent.mapper';

@Controller('v1')
export class CreatePaymentIntentController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly PaymentIntentMapper: PaymentIntentMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Post('create-payment-intent')
  async create(
    @Body() body: CreatePaymentIntentRequestDto,
    @Req() request: any,
  ): Promise<PaymentIntentResponseDto> {
    try {
      const command = CreatePaymentIntentCommand.create(body);
      const result = await this.commandBus.execute(command);
      return this.PaymentIntentMapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'CreatePaymentIntentController.create encountered an error',
        error,
      );
    }
  }
}
