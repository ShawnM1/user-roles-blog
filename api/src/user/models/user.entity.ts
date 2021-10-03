import { Exclude } from 'class-transformer'
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { UserRole } from './user.interface'

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

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER})
    role: UserRole
}
