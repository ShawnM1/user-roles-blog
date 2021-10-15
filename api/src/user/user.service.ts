import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs'
import { AuthService } from 'src/auth/auth.service'
import { Like, Repository } from 'typeorm'
import { UserEntity } from './models/user.entity'
import { User, UserRole } from './models/user.interface'
import {
    paginate,
    Pagination,
    IPaginationOptions,
  } from 'nestjs-typeorm-paginate';

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
                newUser.role = UserRole.USER
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

    paginate(options: IPaginationOptions): Observable<Pagination<User>> {
        return from(paginate<User>(this.userRepository, options))
    }

    paginateFilterByUser(options: IPaginationOptions, user: User): Observable<Pagination<User>> {
        return from(this.userRepository.findAndCount({
             skip: (+options.page - 1) * +options.limit || 0, 
             take: +options.limit || 10,
             order: { id: "ASC" },
             where: [
                 { username: Like(`%${user.username}%`)}
             ]
            })).pipe(
                map(([users, totalUsers]) => {
                    const usersPageable: Pagination<User> = {
                        items: users,
                        links: {
                            first: options.route + `?limit=${options.limit}`,
                            previous: '',
                            next: options.route + `?limit=${options.limit}&page=${+options.page + 1}`,
                            last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalUsers / +options.limit)}`
                        },
                        meta: {
                            currentPage: +options.page,
                            itemCount: users.length,
                            itemsPerPage: +options.limit,
                            totalItems: totalUsers,
                            totalPages: Math.ceil(totalUsers / +options.limit) 
                        }
                    }
                    return usersPageable
                })
            )
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
        delete user.role
        return from(this.userRepository.update(id, user)).pipe(
            switchMap(() => this.findOne(id))
        )
        this.userRepository.save
    }
    
    updateRoleOfUser(id: number, user: User): Observable<any> {
        return from(this.userRepository.update(id, user))
    }
}
