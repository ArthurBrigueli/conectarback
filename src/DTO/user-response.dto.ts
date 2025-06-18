import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {

    @ApiProperty({example: '1'})
    id: number;

    @ApiProperty({example: 'teste'})
    name: string;

    @ApiProperty({example: 'teste@example.com'})
    email: string;

    @ApiProperty({example: 'admin or user'})
    role: string;


    @ApiProperty({ example: null, nullable: true, description: 'Último login do usuário' })
    lastLogin: string | null;
}
