import { Exclude } from 'class-transformer'
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    name?: string

    @Column({ unique: true })
    username?: string

    @Column()
    email: string

    @Column()
    @Exclude()
    password: string

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLocaleLowerCase()
    }
}