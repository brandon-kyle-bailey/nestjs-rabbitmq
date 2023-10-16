import { Body, Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UserMapper } from 'apps/gateway/src/infrastructure/mappers/user.mapper';
import { GetUserRequestDto } from '../../dtos/user/get-user.request.dto';
import { UserResponseDto } from '../../dtos/user/user.response.dto';
import { GetUserQuery } from '../../queries/user/get-user.query';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';

@Controller('v1')
export class GetUserController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: UserMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('user')
  async get(
    @Body() body: GetUserRequestDto,
    @Req() request: any,
  ): Promise<UserResponseDto> {
    try {
      const query = GetUserQuery.create({
        id: body.id,
      });
      const result = await this.queryBus.execute(query);
      const response = this.mapper.toResponse(result);
      return response;
    } catch (error) {
      this.logger.error('GetUserController.get encountered an error', error);
    }
  }
}
