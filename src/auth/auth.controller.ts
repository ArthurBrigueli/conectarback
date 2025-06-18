import { Body, Controller, Get, Injectable, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

interface AuthenticatedRequest extends Request {
  user: any; 
}

@Controller('auth')
export class AuthController {


    

    constructor(
        private readonly authService: AuthService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}
    

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(){

    }


    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: AuthenticatedRequest, @Res() res: Response) {
        
        const googleUser = req.user;

        if (!googleUser || !googleUser.email) {
            return res.redirect(
            `http://localhost:5173/login?error=${encodeURIComponent('No user data from Google')}`,
            );
        }

        let user = await this.userRepository.findOne({ where: { email: googleUser.email } });


        if (!user) {
                user = this.userRepository.create({
                name: googleUser.name,
                email: googleUser.email,
                password: '',
                role: 'user',
            });
            await this.userRepository.save(user);
        }

        const loginResult = await this.authService.login(user);

        return res.redirect(
            `http://localhost:5173/oauth-success?token=${loginResult.access_token}&user=${encodeURIComponent(
                JSON.stringify(loginResult.user),
            )}`,
        );
        
        
    }


    @Post('login')
    async login(@Body() body: {email:string, password: string}){
        const user = await this.authService.validateUser(body.email, body.password)
        return this.authService.login(user)
    }


}
