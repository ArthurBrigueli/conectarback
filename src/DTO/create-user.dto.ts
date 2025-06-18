import { Transform } from "class-transformer"
import { IsEmail, IsString } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class CreateUserDto{

    @IsString({message: 'Nome inválido'})
    @Transform(({ value }) => sanitizeHtml(value))
    name: string

    @IsEmail({}, { message: 'E-mail inválido' })
    email: string

    @IsString()
    password: string
}