
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn, IsString } from 'class-validator';

export class QueryUsersDto {
  @ApiPropertyOptional({ example: 'admin', description: 'Filtrar por role (admin ou user)' })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'user'])
  role?: string;
  sortBy?: 'name' | 'createAt'
  order?: 'asc' | 'desc'
  status?: 'Ativo' | 'Ausente'

}
