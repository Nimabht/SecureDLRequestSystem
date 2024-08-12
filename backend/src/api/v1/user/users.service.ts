import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/Model/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { userId: id } });
  }

  async findOneByGoogleId(googleId: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { googleId } });
  }

  async createUserWithGoogle(
    googleId: string,
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<User> {
    const newUser = this.usersRepository.create({
      googleId,
      email,
      username: `${firstName} ${lastName}`,
    });
    return this.usersRepository.save(newUser);
  }

  async createUser(
    username: string,
    password: string,
    email?: string,
  ): Promise<User> {
    const newUser = this.usersRepository.create({ username, password, email });
    return this.usersRepository.save(newUser);
  }
}
