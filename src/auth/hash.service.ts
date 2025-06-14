import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';


@Injectable()
export class HashService{
    private readonly saltRound = 10;


    async hashPassword(password:string): Promise<string>{
        return await bcrypt.hash(password, this.saltRound)
    }


    async comparePassword(password:string, hashedPassword:string): Promise<boolean>{
        return await bcrypt.compare(password, hashedPassword);
    }

}