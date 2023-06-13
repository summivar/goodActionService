import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UsersModule} from './users/users.module';
import {GoodActionModule} from './good-action/good-action.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING),
    UsersModule,
    GoodActionModule
  ],
})
export class AppModule {
}
