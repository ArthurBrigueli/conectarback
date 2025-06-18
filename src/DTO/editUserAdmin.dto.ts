import { Transform } from "class-transformer"
import { IsEmail, IsNumber, isNumber, IsString } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class EditUserAdmindto{

    @IsString({message: 'Nome inválido'})
    @Transform(({ value }) => sanitizeHtml(value))
    name: string

    @IsEmail({}, { message: 'E-mail inválido' })
    email: string

    @IsString()
    password: string

    @IsNumber()
    id: number

    @IsString()
    role: string
}