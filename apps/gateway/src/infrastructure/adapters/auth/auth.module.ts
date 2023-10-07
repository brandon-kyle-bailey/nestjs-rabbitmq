import { Module } from '@nestjs/common';
import {
  ClientsModule,
  ClientsModuleAsyncOptions,
} from '@nestjs/microservices';
import { adapters } from './auth.adapters';

@Module({
  imports: [ClientsModule.registerAsync(adapters as ClientsModuleAsyncOptions)],
  exports: [ClientsModule],
})
export class AuthModule {}
