import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class AddGoodActionDto {
  @ApiProperty({ example: 'Help mom', description: 'The action name' })
  @IsString()
  nameOfAction: string;

  @ApiProperty({ example: 'I make a dinner to my mom', description: 'The action description' })
  @IsString()
  descriptionOfAction: string;
}