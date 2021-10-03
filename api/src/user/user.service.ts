import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs'
import { AuthService } from 'src/auth/auth.service'
import { Repository } from 'typeorm'
import { UserEntity } from './models/user.entity'
import { User } from './models/user.interface'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly authService: AuthService
    ) {}

    create(user: User): Observable<User> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity()
                newUser.name = user.name
                newUser.username = user.username
                newUser.email = user.email,
                newUser.password = passwordHash
                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        delete user.password
                        return user
                    }),
                    catchError(err => throwError(err))
                )
            })
        )
    }

    findOne(id: number): Observable<User> {
        return from(this.userRepository.findOne({ id }))
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find())
    }

    findbyEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ email })
    }

    deleteOne(id: number): Observable<any> {
        return from(this.userRepository.delete(id))
    }

    updateOne(id: number, user: User): Observable<any> {
        delete user.email
        delete user.password

        return from(this.userRepository.update(id, user))
    }
}
