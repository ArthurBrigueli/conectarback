import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository:Repository<User>
    ){}


    async create(userData: Partial<User>): Promise<User>{
        const user = this.userRepository.create(userData)
        return this.userRepository.save(user)
    }

}
