import { BlogEntry } from "src/blog/models/blog-entry.interface"

export enum UserRole {
    ADMIN = 'admin',
    PUBLISHER = 'publisher',
    EDITOR = 'editor',
    USER = 'user'

}
export class User {
    [x: string]: any
    id?: number
    name?: string
    username?: string
    email?: string
    password?: string
    role?: UserRole
    profileImage?: string
    blogEntries?: BlogEntry[]
}
