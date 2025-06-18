import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashService } from "./hash.service";
import { AuthController } from './auth.controller';
import { UserModule } from "../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { User } from "../user/user.entity";
import { GoogleStrategy } from "./google.strategy";

@Module({
    imports: [
        forwardRef(() => UserModule),
        PassportModule,
        JwtModule.register({
            secret: process.env.SECRET_TOKEN,
        }),
        TypeOrmModule.forFeature([User]),
    ],
    providers: [HashService, AuthService, JwtStrategy, GoogleStrategy],
    exports: [HashService, AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
