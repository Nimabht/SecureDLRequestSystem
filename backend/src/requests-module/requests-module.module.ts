import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsController } from './requests-module.controller';
import { RequestsService } from './requests-module.service';
import { RequestEntity } from '../Model/request.entity';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Module({
  imports: [TypeOrmModule.forFeature([RequestEntity])],
  controllers: [RequestsController],
  providers: [RequestsService, RabbitMQService],
})
export class RequestsModule {}
