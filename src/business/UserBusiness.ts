import { UserDatabase } from "../database/UserDatabase"
import { LoginOutputDtO, SignupInputDTO, SignupOutputDTO } from "../dtos/userDTO"
import { BadRequestError } from "../error/BadRequestError"
import { NotFoundError } from "../error/NotFoundError"
import { User } from "../models/User"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { TokenPayload, USER_ROLES } from "../types"

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) { }

    public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {

        const { name, email, password } = input

        if (typeof name !== "string") {
            throw new BadRequestError("'name' deve ser string")
        }
        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }
        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }

        const userDBExists = await this.userDatabase.findUserEmail(email)

        if (userDBExists) {
            throw new NotFoundError("'email' ja existe");
        }

        const id = this.idGenerator.generate()
        const hashPassword = await this.hashManager.hash(password)
        const role = USER_ROLES.NORMAL
        const createdAt = new Date().toISOString()

        const newUser = new User(
            id,
            name,
            email,
            hashPassword,
            role,
            createdAt
        )
        const newUserDB = newUser.toDBModel()
        await this.userDatabase.insertUser(newUserDB)

        const payload: TokenPayload = {
            id: newUser.getId(),
            name: newUser.getName(),
            role: newUser.getRole()
        }

        const token = this.tokenManager.createToken(payload)

        const output: SignupOutputDTO = {
            token
        }
        return output
    }

    public login = async (input: any) => {
        const { email, password } = input

        if (typeof email !== "string") {
            throw new BadRequestError("'email'deve ser uma string")
        }
        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }

        const searchUserDB = await this.userDatabase.findUserEmail(email)

        if (!searchUserDB) {
            throw new NotFoundError("'email' não encontrado")
        }

        const users = new User(
            searchUserDB.id,
            searchUserDB.name,
            searchUserDB.email,
            searchUserDB.password,
            searchUserDB.role,
            searchUserDB.created_at
        )

        const hashPassword = users.getPassword()
        const correctPassword = await this.hashManager.compare(password, hashPassword)

        if (!correctPassword) {
            throw new NotFoundError("'email' ou 'password' incorretos")
        }

        const payload: TokenPayload = {
            id: users.getId(),
            name: users.getName(),
            role: users.getRole()
        }

        const token = this.tokenManager.createToken(payload)

        const output: LoginOutputDtO = {
            token
        }

        return output
    }
}