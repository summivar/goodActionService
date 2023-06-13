import {IsEmail, IsString, MinLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ example: 'viachlyk@gmail.com', description: 'The email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Slava', description: 'The name of the user' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'slava123', description: 'The user password' })
  @IsString()
  @MinLength(8)
  password: string;
}