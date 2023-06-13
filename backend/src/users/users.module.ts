import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {User, UsersSchema} from './schemas/user.schema';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {TokenModule} from '../token/token.module';
import {HelperModule} from '../helper/helper.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    MongooseModule.forFeature([
      {name: User.name, schema: UsersSchema}
    ]),
    TokenModule,
    HelperModule
  ],
  exports: [UsersService]
})
export class UsersModule{}