import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { promises } from 'dns';
import { STATUS_CODES } from 'http';

@Controller('users')
export class UserController {

    constructor(
        private readonly userService: UserService
    ){}

    @Post()
    async create(@Body() userData: Partial<User>){
        const user = await this.userService.create(userData)

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Usuário criado com sucesso',
        };

    }


}
