import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HashService } from '../../auth/hash.service';
import { userMock } from '../__mocks__/user.mock';
import { QueryUsersDto } from 'src/DTO/query-users.dto';
import { HttpStatus } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>
  let hashService: jest.Mocked<HashService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
      
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(userMock),
            find: jest.fn().mockResolvedValue(userMock),
            findOneBy: jest.fn().mockResolvedValue(userMock),
            save: jest.fn().mockResolvedValue(userMock),
            delete: jest.fn().mockResolvedValue(userMock)
          }
        },
        {
          provide: HashService,
          useValue: {
            hashPassword: jest.fn(),
          },
        }
      
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    hashService = module.get(HashService);

    userRepository = module.get<Repository<User>>(
      getRepositoryToken(User)
    )

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(hashService).toBeDefined();
  });


  it('should be defined', async() => {

    const user = await service.findByEmail(userMock.email)

    expect(user).toEqual(userMock)


  });


  it('should be defined', async() => {

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null)

    expect(service.findByEmail(userMock.email)).rejects.toThrow()


  });


  it('should return users with formatted lastLogin', async () => {
    const queryUserDto: QueryUsersDto = {
      role: undefined,
      sortBy: 'name',
      order: 'asc',
    };

    jest.spyOn(userRepository, 'find').mockResolvedValue([userMock]);

    const result = await service.findAllUser(queryUserDto);

    expect(result).toEqual([
      {
        id: userMock.id,
        name: userMock.name,
        email: userMock.email,
        role: userMock.role,
        lastLogin: userMock.lastLogin
          ? `${userMock.lastLogin.toLocaleDateString('pt-BR')} às ${userMock.lastLogin.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}`
          : 'Não efetuou o primeiro login',
      },
    ]);
  });

  it('should delete user', async()=>{
    jest.spyOn(userRepository, 'delete').mockResolvedValue({ affected: 1 } as any);
    const result = await service.deleteUser(userMock.id);

    expect(result).toEqual(202)
  })

  it('should throw if user not exist', async()=>{
    jest.spyOn(userRepository, 'delete').mockResolvedValue({ affected: 0 } as any);
    await expect(service.deleteUser(userMock.id)).rejects.toThrow('Usuário não encontrado');
  })

  it('should return BAD_REQUEST if id is not provided', async () => {
    const result = await service.deleteUser(null as any);

    expect(result).toBe(HttpStatus.BAD_REQUEST);
  });


  it('should update user and return user without password', async () => {
    const updatedUserMock = {
      ...userMock,
      name: 'Novo Nome',
      password: 'senhaHasheada',
    };

    const input = {
      id: userMock.id,
      name: 'Novo Nome',
      password: 'senha123',
      role: 'admin',
      email: 'arthur@gmail.com'
    };

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(userMock);
    jest.spyOn(hashService, 'hashPassword').mockResolvedValue('senhaHasheada');
    jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUserMock);

    const result = await service.editUser(input);

    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userMock.id });
    expect(hashService.hashPassword).toHaveBeenCalledWith('senha123');
    expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Novo Nome',
      password: 'senhaHasheada',
    }));

    expect(result).toEqual(expect.objectContaining({
      id: userMock.id,
      name: 'Novo Nome',
      email: userMock.email,
    }));

    expect(result).not.toHaveProperty('password');
  });

  it('should throw if user is not found', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

    const input = {
      id: 999,
      name: 'Qualquer Nome',
      password: 'senha123',
      role: 'user',
      email: 'example@gmail.com'
      
    };

    await expect(service.editUser(input)).rejects.toThrow('Usuário não encontrado');
  });



  
  describe('UserService - create', () => {
    
    it('should create a user successfully', async () => {
      const hashed = 'hashedPassword123';
      hashService.hashPassword.mockResolvedValue(hashed);

      const userToCreate = {
        ...userMock,
        password: 'senha123'
      };

      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...userToCreate,
        password: hashed,
      });

      const result = await service.create(userToCreate);

      expect(result).toEqual({
        STATUS_CODES: HttpStatus.CREATED,
        message: "Criado com sucesso",
        user: {
          id: userMock.id,
          name: userMock.name,
          email: userMock.email,
          role: userMock.role,
          lastLogin: userMock.lastLogin,
          createdAt: userMock.createdAt,
          updatedAt: userMock.updatedAt
        }
      });

      expect(hashService.hashPassword).toHaveBeenCalledWith('senha123');
      expect(userRepository.save).toHaveBeenCalledWith({
        ...userToCreate,
        password: hashed,
      });
    });



  });
  



});
