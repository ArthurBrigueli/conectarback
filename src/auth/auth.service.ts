import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt'
import { error } from "console";

@Injectable()
export class AuthService{
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}


    async validateUser(email:string, password: string){
        const user = await this.userService.findByEmail(email)
        if(!user || !(await bcrypt.compare(password, user.password))){
            throw new UnauthorizedException("Credenciais incorreta")
        }

        return user
    }


    async login(user: any){
        const payload = {sub: user.id, email: user.email, role: user.role}
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    }





}