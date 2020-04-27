import { Repository, EntityRepository } from 'typeorm';
import { UserEntity } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async singUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new UserEntity();
    user.username = username;
    user.password = password;

    try {
      await user.save();
    } catch (error) {
      // duplicate username
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
