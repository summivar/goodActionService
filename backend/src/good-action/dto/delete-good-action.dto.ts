import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class DeleteGoodActionDto {
  @ApiProperty({ example: '', description: 'The uuid' })
  @IsString()
  id: string;
}