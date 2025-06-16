import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashService } from "./hash.service";
import { AuthController } from './auth.controller';
import { UserModule } from "src/user/user.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { User } from "src/user/user.entity";

@Module({
    imports: [
        forwardRef(() => UserModule),
        PassportModule,
        JwtModule.register({
            secret: 'arthurbriguelitesteconectar',
        }),
        TypeOrmModule.forFeature([User]),
    ],
    providers: [HashService, AuthService, JwtStrategy],
    exports: [HashService, AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
