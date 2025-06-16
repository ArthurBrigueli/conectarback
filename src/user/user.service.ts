import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { HashService } from 'src/auth/hash.service';
import { STATUS_CODES } from 'http';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository:Repository<User>,
        private hashService:HashService
    ){}


    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }


    async findAllUser(): Promise<Partial<User>[]> {
        return this.userRepository.find({
            select: ['id', 'name', 'email', 'role']
        })
    }


    async editUser(editUser: Partial<User> & { id: number }): Promise<Partial<User>> {
        const { id, password, ...updateData } = editUser;

        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        const dataToUpdate: Partial<User> = { ...updateData };

        if (password && password.trim() !== '') {

            dataToUpdate.password = await this.hashService.hashPassword(password);
        }

        Object.assign(user, dataToUpdate);

        const updatedUser = await this.userRepository.save(user);

        const { password: _, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }


    async deleteUser(id:number){
        if(!id){
            throw new Error('Nenhum id fornecido')
        }


        await this.userRepository.delete({id})

    }




    async create(userData: Partial<User>) {
        if (!userData.password) {
            throw new Error('Password is required');
        }

        const hashedPassword = await this.hashService.hashPassword(userData.password);

        const user = await this.userRepository.save({
            ...userData,
            password: hashedPassword,
        });

        const { password, ...userWithoutPassword } = user;

        return {
            STATUS_CODES: HttpStatus.CREATED,
            message: "Criado com sucesso",
            user: userWithoutPassword
        };
    }

}
