import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private channel: amqp.Channel;
  //   'amqp://localhost';
  async connect() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    this.channel = await connection.createChannel();
    await this.channel.assertQueue('requests', { durable: true });
  }

  async publish(queue: string, message: string) {
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async consume(queue: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.channel.consume(queue, (msg) => {
        if (msg !== null) {
          const message = msg.content.toString();
          this.channel.ack(msg);
          resolve(message);
        } else {
          reject('No messages in queue');
        }
      });
    });
  }
}
