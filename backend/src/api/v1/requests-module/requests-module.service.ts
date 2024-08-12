import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestEntity } from 'src/Model/request.entity';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

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
      throw new UnauthorizedException();
    }
    try {
      const requestId = await this.rabbitMQService.consume('requests');
      const request = await this.requestsRepository.findOne({
        where: { id: +requestId },
      });

      if (!request) {
        throw new NotFoundException('Request not found');
      }

      request.status = 'processing';
      await this.requestsRepository.save(request);

      return request;
    } catch (error) {
      if (error === 'No messages in queue') {
        throw new NotFoundException('No messages in queue');
      }
    }
  }

  async submitResults(
    resultsData: { requestId: string; result: string }[],
    secret: string,
  ) {
    if (secret !== process.env.AI_SECRET) {
      throw new UnauthorizedException();
    }

    for (const { requestId, result } of resultsData) {
      const request = await this.requestsRepository.findOne({
        where: { id: +requestId },
      });

      if (!request) {
        throw new NotFoundException(`Request with ID ${requestId} not found`);
      }

      request.status = 'completed';
      request.result = result;
      await this.requestsRepository.save(request);
    }
  }

  async getResult(requestId: string) {
    const request = await this.requestsRepository.findOne({
      where: { id: +requestId },
    });

    if (!request) throw new NotFoundException();
  }
}
