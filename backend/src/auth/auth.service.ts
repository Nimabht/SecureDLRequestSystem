import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/Model/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user.password) {
      return null;
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user; // Omit password from the result
      return result;
    }
    return null;
  }

  async validateGoogleUser(
    googleId: string,
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<any> {
    let user = await this.usersService.findOneByGoogleId(googleId);
    if (!user) {
      // If user doesn't exist, create a new one
      user = await this.usersService.createUserWithGoogle(
        googleId,
        email,
        firstName,
        lastName,
      );
    }
    return this.login(user); // Generate JWT token for the user
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(
    username: string,
    password: string,
    email?: string,
  ): Promise<User> {
    const existingUser = await this.usersService.findOneByUsername(username);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.usersService.createUser(
      username,
      hashedPassword,
      email,
    );
    return newUser;
  }

  async validateToken(token: string): Promise<User> {
    const decoded = this.jwtService.verify(token);
    return this.usersService.findOneById(decoded.sub);
  }
}
