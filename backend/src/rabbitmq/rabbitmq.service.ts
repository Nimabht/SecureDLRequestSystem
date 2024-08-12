import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    await this.connect();
  }

  async connect() {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await connection.createChannel();
      await this.channel.prefetch(1, true);
      console.log('RabbitMQ connected and channel created successfully');
      await this.channel.assertQueue('requests', { durable: true });
    } catch (error) {
      console.error('Failed to connect to RabbitMQ', error);
    }
  }

  async publish(queue: string, message: string) {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not initialized');
    }
    console.log(`Publishing message to queue: ${queue}`, message);
    this.channel.sendToQueue('requests', Buffer.from(message));
  }

  async consume(queue: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.channel.get(queue).then((msg) => {
        if (msg !== false) {
          const message = msg.content.toString();
          this.channel.ack(msg);
          console.log(`consuming ${message}`);
          resolve(message);
        } else {
          reject('No messages in queue');
        }
      });
    });
  }
}
