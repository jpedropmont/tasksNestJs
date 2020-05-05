import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const server = config.get('server');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '192.168.99.100',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'taskmanagement',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
