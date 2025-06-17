import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import * as bcrypt from 'bcrypt'
import { error } from "console";
import { User } from "../user/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Injectable()
export class AuthService{
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ){}


    async validateUser(email:string, password: string){
        const user = await this.userService.findByEmail(email)
        if(!user || !(await bcrypt.compare(password, user.password))){
            throw new UnauthorizedException("Credenciais incorreta")
        }

        return user
    }


    @ApiOperation({ summary: 'Fazer login' })
    @ApiResponse({ status: 201, description: 'Token de acesso' })
    @ApiResponse({ status: 400, description: 'Credenciais incorreta' })
    @ApiBearerAuth()
    async login(user: any) {
        const payload = { sub: user.id, email: user.email, role: user.role };

        const lastLogin = new Date()

        await this.userRepository.update(user.id, { lastLogin });

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                lastLogin: lastLogin
                ? `${lastLogin.toLocaleDateString('pt-BR')} às ${lastLogin.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    })}`
                : "Não efetuou o primeiro login",
            },
        };
    }






}