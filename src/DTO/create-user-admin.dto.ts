import { Transform, Type } from "class-transformer"
import { IsEmail, IsIn, IsNumber, IsString } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class CreateUserAdmindto{

    @IsString({message: 'Nome inválido'})
    @Transform(({ value }) => sanitizeHtml(value))
    name: string

    @IsEmail({}, { message: 'E-mail inválido' })
    email: string

    @IsString()
    password: string

    @IsString()
    @IsIn(['admin', 'user'], { message: 'Role inválido. Valores permitidos: admin, user' })
    role: string
}