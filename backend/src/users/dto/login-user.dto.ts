import {IsEmail, IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'viachlyk@gmail.com', description: 'The email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'slava123', description: 'The user password' })
  @IsString()
  password: string;
}