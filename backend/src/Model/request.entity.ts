// requests/request.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('requests')
export class RequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  prompt: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  result: string;

  @Column({
    type: 'text',
    default: 'queued',
  })
  status: 'queued' | 'processing' | 'completed';

  @CreateDateColumn()
  createdAt: Date;
}
