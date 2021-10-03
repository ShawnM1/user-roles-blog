import { Exclude } from "class-transformer"

export enum UserRole {
    ADMIN = 'admin',
    PUBLISHER = 'publisher',
    EDITOR = 'editor',
    USER = 'user'

}
export class User {
    id?: number
    name?: string
    username?: string
    email?: string

    @Exclude()
    password?: string
    role?: UserRole
}
