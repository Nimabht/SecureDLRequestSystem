import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestEntity } from 'src/Model/request.entity';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(RequestEntity)
    private requestsRepository: Repository<RequestEntity>,
    private rabbitMQService: RabbitMQService,
  ) {}

  async createRequest(userId: string, prompt: string) {
    const request = this.requestsRepository.create({ userId, prompt });
    await this.requestsRepository.save(request);
    await this.rabbitMQService.publish('requests', String(request.id));
    return request;
  }

  async getNextRequest(secret: string) {
    if (secret !== process.env.AI_SECRET) {
      throw new Error('Unauthorized');
    }
    const requestId = await this.rabbitMQService.consume('requests');
    return this.requestsRepository.findOne({ where: { id: +requestId } });
  }

  async submitResult(requestId: string, result: string, secret: string) {
    if (secret !== process.env.AI_SECRET) {
      throw new Error('Unauthorized');
    }
    const request = await this.requestsRepository.findOne({
      where: { id: +requestId },
    });
    request.status = 'completed';
    request.result = result;
    await this.requestsRepository.save(request);
  }

  async getResult(requestId: string) {
    return this.requestsRepository.findOne({ where: { id: +requestId } });
  }
}
