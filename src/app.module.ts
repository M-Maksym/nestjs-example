import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
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
    ConfigModule.forRoot({
      envFilePath: [`.env.${environment}`, '.env'],
      isGlobal: true,
    }),
    MongooseModule.forRoot(mongoConnectionString),
  ],
})
export class AppModule {}
