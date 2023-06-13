import {Module} from '@nestjs/common';
import {TokenService} from './token.service';
import {JwtModule} from '@nestjs/jwt';
import {MongooseModule} from '@nestjs/mongoose';
import {TokensSchema} from './schemas/token.schema';

@Module({
  providers: [TokenService],
  exports: [TokenService],
  imports: [
    MongooseModule.forFeature([
      {name: 'Tokens', schema: TokensSchema}
    ]),
    JwtModule.register({})
  ]
})
export class TokenModule {
}
