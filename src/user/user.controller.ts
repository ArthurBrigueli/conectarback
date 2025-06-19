import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryUsersDto } from '../DTO/query-users.dto';
import { EditUserRegulardto } from '../DTO/editUserRegular.dto';
import { EditUserAdmindto } from '../DTO/editUserAdmin.dto';
import { CreateUserDto } from '../DTO/create-user.dto';
import { CreateUserAdmindto } from '../DTO/create-user-admin.dto';


@ApiTags("Usuarios")
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {

    constructor(
        private readonly userService: UserService
    ){}

    @Public()
    @Post('register')   
    @ApiOperation({ summary: 'Cria um novo usuário' })
    @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' }) 
    async create(@Body() userData: CreateUserDto){
        return await this.userService.create(userData)
    }


    @ApiOperation({ summary: 'Admin cria um novo usuario' })
    @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    @ApiBearerAuth()
    @Roles('admin')
    @Post('admin/register')
    async AdmincreateUser(@Body() userData: CreateUserAdmindto){
        return await this.userService.createAdmin(userData)
    }


    @Roles('admin')
    @Get()
    @ApiOperation({ summary: 'Busca todos os usuários com filtros e ordenação opcionais' })
    @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso.' })
    @ApiBearerAuth()
    async findAll(@Query() query: QueryUsersDto) {
        return await this.userService.findAllUser(query);
    }


    @Roles('admin')
    @Post("user/edit")
    @ApiOperation({ summary: 'Editar as informaçoes do usuario' })
    @ApiResponse({ status: 201, description: 'Usuário editado com sucesso.' })
    @ApiResponse({ status: 400, description: 'ocorreu um erro' })
    @ApiBearerAuth()
    async editUser(@Body() userData: EditUserAdmindto) {
        if (!userData.id) {
            throw new BadRequestException("O campo 'id' é obrigatório para editar o usuário.");
        }
        return await this.userService.editUser(userData);
    }


    @Public()
    @Post("user/profile/edit")
    @ApiOperation({ summary: 'Editar as informaçoes do usuario' })
    @ApiResponse({ status: 201, description: 'Usuário editado com sucesso.' })
    @ApiResponse({ status: 400, description: 'ocorreu um erro' })
    async editUserRegular(@Body() userData: EditUserRegulardto) {
        if (!userData.id) {
            throw new BadRequestException("O campo 'id' é obrigatório para editar o usuário.");
        }
        return await this.userService.editUserRegular(userData);
    }


    @Roles('admin')
    @Delete("user/delete/:id")
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiOperation({ summary: 'Deletar um usuario' })
    @ApiResponse({ status: 201, description: 'Usuario deletado com sucesso' })
    @ApiResponse({ status: 400, description: 'Ocorreu um erro' })
    @ApiBearerAuth()
    async deleteUser(@Param('id') id: number){
        return this.userService.deleteUser(id)
    }
    


}
