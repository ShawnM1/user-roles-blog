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
    password?: string
    role?: UserRole
    profileImage?: string
}
