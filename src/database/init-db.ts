// admin-init.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class AdminInitService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    const admin = await this.userRepository.findOneBy({ email: 'admin@gmail.com' }); // MESMO EMAIL
        if (!admin) {
            const senhaHash = await bcrypt.hash('admin', 10);
            const newAdmin = this.userRepository.create({
            name: 'admin',
            email: 'admin@gmail.com',
            password: senhaHash,
            role: 'admin',
            });
            await this.userRepository.save(newAdmin);
            console.log('Admin criado');
        }
    }
}
