import { BaseDatabase } from "../../src/database/BaseDatabase"
import { UserDB, USER_ROLES } from "../../src/types"

export class UserDatabaseMock extends BaseDatabase {
    public static TABLE_USERS = "users"

    public insertUser = async (userDB: UserDB): Promise<void> => {
    }

    public async findUserById(id: string): Promise<UserDB | undefined> {
        switch (id) {
            case "id-mock-normal":
                return {
                    id: "id-mock-normal",
                    name: "Normal Mock",
                    email: "normal@email.com",
                    password: "hash-backend",
                    role: USER_ROLES.NORMAL,
                    created_at: new Date().toISOString()
                }
            case "id-mock-admin":
                return {
                    id: "id-mock-admin",
                    name: "Admin Mock",
                    email: "admin@email.com",
                    password: "hash-backend",
                    role: USER_ROLES.ADMIN,
                    created_at: new Date().toISOString()
                }
            default:
                return undefined
        }
    }
    
    public findUserEmail = async (email: string): Promise<UserDB | undefined> => {
        switch (email) {
            case "normal@email.com":
                return {
                    id: "id-mock",
                    name: "Normal Mock",
                    email: "normal@email.com",
                    password: "hash-bananinha",
                    created_at: new Date().toISOString(),
                    role: USER_ROLES.NORMAL
                }
            case "admin@email.com":
                return {
                    id: "id-mock",
                    name: "Admin Mock",
                    email: "admin@email.com",
                    password: "hash-bananinha",
                    created_at: new Date().toISOString(),
                    role: USER_ROLES.ADMIN
                }
            default:
                return undefined
        }
    }

    public getAllUsers = async (): Promise<UserDB[]> => {
        return [
            {
                id: "id-mock",
                name: "Normal Mock",
                email: "normal@email.com",
                password: "hash-bananinha",
                created_at: new Date().toISOString(),
                role: USER_ROLES.NORMAL
            },
            {
                id: "id-mock",
                name: "Admin Mock",
                email: "admin@email.com",
                password: "hash-bananinha",
                created_at: new Date().toISOString(),
                role: USER_ROLES.ADMIN
            }
        ]
    }
}