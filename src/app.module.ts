import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

import { configModule } from './configure.root';
import { TokenModule } from './token/token.module';

dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const mongoConnectionString = process.env.MONGODB_WRITE_CONNECTION_STRING;
if (!mongoConnectionString) {
  console.log({ environment });
  throw new Error(
    'MONGODB_WRITE_CONNECTION_STRING is not defined in the environment variables.',
  );
}

@Module({
  imports: [
    UserModule,
    AuthModule,
    configModule,
    MongooseModule.forRoot(mongoConnectionString),
    TokenModule,
  ],
})
export class AppModule {}
