import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {

    constructor(
        private readonly userService: UserService
    ){}

    @Public()
    @Post('register')    
    async create(@Body() userData: Partial<User>){
        return await this.userService.create(userData)
    }

    @Roles('admin')
    @Post('admin/register')
    async AdmincreateUser(@Body() userData: Partial<User>){
        return await this.userService.create(userData)
    }


    @Roles('admin')
    @Get()
    async findAll(){
        return await this.userService.findAllUser()
    }


    @Roles('admin')
    @Post("user/edit")
    async editUser(@Body() userData: Partial<User> & { id?: number }) {
        if (!userData.id) {
            throw new BadRequestException("O campo 'id' é obrigatório para editar o usuário.");
        }
        return await this.userService.editUser(userData as Partial<User> & { id: number });
    }


    @Roles('admin')
    @Delete("user/delete/:id")
    async deleteUser(@Param('id') id: number){
        return this.userService.deleteUser(id)
    }
    


}
