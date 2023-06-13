import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class FriendUserDto {
  @ApiProperty({ example: '#', description: 'The uniqueId' })
  @IsString()
  uniqueId: string
}