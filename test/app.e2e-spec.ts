import { Test, TestingModule } from '@nestjs/testing';
import { HttpCode, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './../src/user/user.entity'; // ajuste o path conforme seu projeto
import { STATUS_CODES } from 'http';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  const payload = { sub: 1, email: 'arthurbrigueli@gmail.com', role: 'admin' };
  const secret = process.env.JWT_SECRET || 'arthurbriguelitesteconectar'; 
  const token = jwt.sign(payload, secret, { expiresIn: '1h' }); 

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    await userRepository.clear();

    await userRepository.save([
      {
        id: 1,
        name: 'arthur',
        email: 'arthurbrigueli@gmail.com',
        role: 'admin',
        password: 'senha123',
        lastLogin: '2025-06-20 00:00:00',
      },
      {
        id: 2,
        name: 'julio',
        email: 'julio@gmail.com',
        role: 'user',
        password: 'senha123',
        lastLogin: '2025-06-20 00:00:00',
      },
    ]);
  });

  beforeEach(async () => {
    const repository = app.get(getRepositoryToken(User));
    await repository.clear();

    await repository.save([
      {
        id: 1,
        name: 'arthur',
        email: 'arthurbrigueli@gmail.com',
        role: 'admin',
        password: 'senha123',
        lastLogin: '2025-06-20 00:00:00',
      },
      {
        id: 2,
        name: 'julio',
        email: 'julio@gmail.com',
        role: 'user',
        password: 'senha123',
        lastLogin: '2025-06-20 00:00:00',
      },
    ]);
  });


  afterAll(async () => {
    await app.close();
  });


  describe('Return users', ()=>{
    it('/users (GET) - deve retornar lista de usuários', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect([
          {
            id: 1,
            name: 'arthur',
            email: 'arthurbrigueli@gmail.com',
            role: 'admin',
            lastLogin: '20/06/2025 às 00:00',
          },
          {
            id: 2,
            name: 'julio',
            email: 'julio@gmail.com',
            role: 'user',
            lastLogin: '20/06/2025 às 00:00',
          },
        ]);
    });
  })

  describe('delete user', ()=>{
    it('/users/user/delete/:id', async()=>{

      const id = 1

      const response = await request(app.getHttpServer())
        .delete(`/users/user/delete/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.ACCEPTED)
    })
  })

  describe('Edit User', ()=>{
    it('/users/user/edit', async()=>{
      const userData = {
          id: '1',
          name: 'arthur',
          email: 'arthurbrigueli@gmail.com',
          role: 'user',
          password: 'nova senha',
      }

      const response = await request(app.getHttpServer())
        .post('/users/user/edit')
        .set('Authorization', `Bearer ${token}`)
        .send(userData)
        
        expect(response.body).toEqual(
          expect.objectContaining({
            id: 1,
            name: 'arthur',
            email: 'arthurbrigueli@gmail.com',
            role: 'user',
            createdAt: expect.any(String),
            lastLogin: expect.any(String),
            updatedAt: expect.any(String),
          })
        );

    })
  })


  describe('Create account', () => {
    it('/users/register (POST)', async () => {
      const userData = {
        name: 'Novo Usuário',
        email: 'novo@example.com',
        password: 'senha123',
        role: 'user'
      };

      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(userData)
        .expect(HttpStatus.CREATED);

        expect(response.body).toEqual({
          STATUS_CODES: HttpStatus.CREATED,
          message: 'Criado com sucesso',
          user: expect.objectContaining({
            id: expect.any(Number),
            name: userData.name,
            email: userData.email,
            role: userData.role,
          })
      });
    });
  });
});
