import { Exclude } from 'class-transformer'
import { BlogEntryEntity } from 'src/blog/models/blog-entry.entity'
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { UserRole } from './user.interface'

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    name?: string

    @Column({ unique: true })
    username?: string

    @Column({ unique: true })
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

    @Column({nullable: true})
    profileImage: string

    @OneToMany(type => BlogEntryEntity, blogEntryEntity => blogEntryEntity.author)
    blogEntries: BlogEntryEntity[]  
}
