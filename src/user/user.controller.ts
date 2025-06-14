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
        return await this.userService.create(userData)
    }


}
