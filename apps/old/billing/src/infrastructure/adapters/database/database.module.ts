import { Module } from '@nestjs/common';
import { adapters, databaseConfiguration } from './database.adapters';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      databaseConfiguration as unknown as PostgresConnectionOptions,
    ),
  ],
  providers: [...adapters],
  exports: [...adapters],
})
export class DatabaseModule {}
