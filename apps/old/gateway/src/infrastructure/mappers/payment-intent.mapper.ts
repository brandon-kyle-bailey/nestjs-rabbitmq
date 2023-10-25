import { Injectable } from '@nestjs/common';
import { Mapper } from 'libs/ddd/mapper.base';
import { PaymentIntentResponseDto } from '../../interface/dtos/billing/payment-intent.response.dto';

@Injectable()
export class PaymentIntentMapper
  implements
    Omit<
      Mapper<any, any, PaymentIntentResponseDto>,
      'toPersistence' | 'toDomain'
    >
{
  toResponse(entity: string): PaymentIntentResponseDto {
    const response = new PaymentIntentResponseDto();
    response.client_secret = entity;
    return response;
  }
}
