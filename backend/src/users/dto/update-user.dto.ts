import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'summimasen', description: 'The username' })
  @IsString()
  username: string
}