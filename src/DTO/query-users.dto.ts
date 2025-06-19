
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn, IsString } from 'class-validator';

export class QueryUsersDto {
  @ApiPropertyOptional({ example: 'admin', description: 'Filtrar por role (admin ou user)' })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'user'])
  role?: string;


  @ApiPropertyOptional({ example: 'name', description: 'Ordenar por campo (name ou createdAt)' })
  @IsOptional()
  @IsString()
  @IsIn(['name', 'createdAt'])
  sortBy?: 'name' | 'createAt'


  @ApiPropertyOptional({ example: 'asc', description: 'Ordem da ordenação (asc ou desc)' })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc'



  @ApiPropertyOptional({ example: 'Ativo', description: 'Status do usuário (Ativo ou Ausente)' })
  @IsOptional()
  @IsString()
  @IsIn(['Ativo', 'Inativo'])
  status?: 'Ativo' | 'Inativo'

}
