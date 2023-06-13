import {Module} from '@nestjs/common';
import {GoodActionService} from './good-action.service';
import {GoodActionController} from './good-action.controller';
import {TokenModule} from '../token/token.module';
import {HelperModule} from '../helper/helper.module';
import {UsersModule} from '../users/users.module';

@Module({
  providers: [GoodActionService],
  controllers: [GoodActionController],
  imports: [
    TokenModule,
    HelperModule,
    UsersModule
  ]
})
export class GoodActionModule {
}
