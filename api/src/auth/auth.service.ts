import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable} from 'rxjs';
import { User } from 'src/user/models/user.interface';
import { UserService } from '../user/user.service';

var bcrypt = require('bcryptjs');

@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService, @Inject(forwardRef(() => UserService ))private readonly userService: UserService) {}

    hashPassword(password: string): Observable<string> {
        return from<string>(bcrypt.hash(password, 12))
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findbyEmail(username)
        if ( user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null
    }

    async login(user: User) {
        return { access_token: this.jwtService.sign({ sub: user.id, ...user })}
    }
}
