import { HttpCode, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { HashService } from '../auth/hash.service';
import { STATUS_CODES } from 'http';
import * as bcrypt from 'bcrypt'
import { UserResponseDto } from '../DTO/user-response.dto';
import { QueryUsersDto } from '../DTO/query-users.dto';
import { EditUserRegulardto } from '../DTO/editUserRegular.dto';
import { stat } from 'fs';
import { EditUserAdmindto } from '../DTO/editUserAdmin.dto';
import { CreateUserDto } from '../DTO/create-user.dto';
import { CreateUserAdmindto } from '../DTO/create-user-admin.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository:Repository<User>,
        private hashService:HashService
    ){}


    async findByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email } });

        if(!user){
            throw new NotFoundException('Usuario nao encontrado')
        }

        return user
    }


    
    async findAllUser(query: QueryUsersDto): Promise<UserResponseDto[]> {
        const { role, sortBy = 'name', order = 'ASC', status } = query;

        const where = role ? { role } : {};

        const users = await this.userRepository.find({
            select: ['id', 'name', 'email', 'role', 'lastLogin', 'createdAt'],
            where,
            order: {
                [sortBy]: order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
            },
        });

        const now = new Date();

        const mappedUsers = users.map(user => {
            const lastLoginFormatted = user.lastLogin
                ? `${user.lastLogin.toLocaleDateString('pt-BR')} às ${user.lastLogin.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                })}`
                : 'Não efetuou o primeiro login';

            let isActive = false;

            if (user.lastLogin instanceof Date && !isNaN(user.lastLogin.getTime())) {
                const daysSinceLastLogin = (now.getTime() - user.lastLogin.getTime()) / (1000 * 60 * 60 * 24);
                isActive = daysSinceLastLogin <= 30;
            }

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                lastLogin: lastLoginFormatted,
                isActive,
            };
        });

        const filteredUsers = status
            ? mappedUsers.filter(user => status === 'Ativo' ? user.isActive : !user.isActive)
            : mappedUsers;

        return filteredUsers;
    }




    async editUser(editUser: EditUserAdmindto): Promise<Partial<EditUserAdmindto>> {
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

    async editUserRegular(editUser: EditUserRegulardto): Promise<Partial<EditUserRegulardto>> {
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


    async deleteUser(id: number): Promise<Partial<HttpStatus>> {
        if (!id) {
            return HttpStatus.BAD_REQUEST;
        }

        const result = await this.userRepository.delete({ id });

        if (result.affected === 0) {
            throw new Error('Usuário não encontrado');
        }

        return HttpStatus.ACCEPTED;
    }


    async createAdmin(userData: CreateUserAdmindto) {
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


    async create(userData: CreateUserDto) {
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
