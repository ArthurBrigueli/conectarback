import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { HashService } from 'src/auth/hash.service';
import { STATUS_CODES } from 'http';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository:Repository<User>,
        private hashService:HashService
    ){}


    async create(userData: Partial<User>){
        
        if(!userData.password){
            throw new Error('Password is required')
        }

        const hashedPassword = await this.hashService.hashPassword(userData.password);


        const user = await this.userRepository.save({
            ...userData,
            password: hashedPassword
        })

        return {
            STATUS_CODES: HttpStatus.CREATED,
            message: "Criado com sucesso",
            body: {
                createdAt: user.createdAt
            }
        }
    }

}
