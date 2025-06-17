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

    lastLogin: string | null;
}
