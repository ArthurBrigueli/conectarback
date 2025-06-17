import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { HashService } from '../auth/hash.service';
import { STATUS_CODES } from 'http';
import * as bcrypt from 'bcrypt'
import { UserResponseDto } from '../DTO/user-response.dto';
import { QueryUsersDto } from '../DTO/query-users.dto';
import { EditUserRegulardto } from '../DTO/editUserRegular.dto';

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


    
    async findAllUser(query: QueryUsersDto): Promise<UserResponseDto[]> {
        const { role, sortBy = 'name', order = 'ASC' } = query;

        const where = role ? { role } : {};

        const users = await this.userRepository.find({
            select: ['id', 'name', 'email', 'role', 'lastLogin', 'createdAt'],
            where,
            order: {
            [sortBy]: order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
            },
        });

        return users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin
            ? `${user.lastLogin.toLocaleDateString('pt-BR')} às ${user.lastLogin.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                })}`
            : 'Não efetuou o primeiro login',
        }));
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

    async editUserRegular(editUser: Partial<EditUserRegulardto> & { id: number }): Promise<Partial<EditUserRegulardto>> {
        const { id, password, ...updateData } = editUser;

        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        const dataToUpdate: Partial<EditUserRegulardto> = { ...updateData };

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
