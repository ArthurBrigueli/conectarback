import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class User{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    email:string;

    @Column()
    password: string;

    @Column({default: "user"})
    role: string;


    @CreateDateColumn()
    createdAt:Date;

    @Column({ type: 'datetime', nullable: true })
    lastLogin: Date | null;


    @UpdateDateColumn()
    updatedAt:Date



}