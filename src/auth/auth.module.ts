import { forwardRef, Module } from "@nestjs/common";
import { HashService } from "./hash.service";
import { AuthController } from './auth.controller';
import { UserModule } from "src/user/user.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
    imports: [
        forwardRef(()=>UserModule),
        PassportModule,
        JwtModule.register({
            secret: 'arthurbriguelitesteconectar'
        }),
    ],
    providers: [HashService, AuthService, JwtStrategy],

    exports: [HashService],

    controllers: [AuthController]
})

export class AuthModule{}