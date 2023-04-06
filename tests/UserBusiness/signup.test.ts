import { UserBusiness } from "../../src/business/UserBusiness"
import { UserDatabase } from "../../src/database/UserDatabase"
import { SignupInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/error/BadRequestError"
import { NotFoundError } from "../../src/error/NotFoundError"
import { USER_ROLES, UserDB } from "../../src/types"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("signup", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    const userDatabase = new UserDatabase()

    test("cadastro bem-sucedido retorna token", async () => {
        const input: SignupInputDTO = {
            name: "Example Mock",
            email: "example@email.com",
            password: "bananinha"
        }

        const response = await userBusiness.signup(input)
        expect(response.token).toBe("token-mock-normal")
    })

    // test("deve disparar erro caso email já exista", async () => {

    //     expect.assertions(2)

    //     try {
    //         const input: UserDB | undefined = {
    //             id: "id-mock",
    //             name: "Normal Mock",
    //             email: "email-que-nao-existe@mail.com",
    //             password: "hash-bananinha",
    //             created_at: new Date().toISOString(),
    //             role: USER_ROLES.ADMIN
    //         }

    //         await userDatabase.findUserEmail(input.email)

    //     } catch (error) {
    //         if (error instanceof NotFoundError) {
    //             expect(error.message).toBe("'email' ja existe")
    //             expect(error.statusCode).toBe(404)
    //         }
    //     }
    // })

    test("deve disparar erro caso name não for string", async () => {

        expect.assertions(2)

        try {
            const input = {
                name: 25,
                email: "example@email.com",
                password: "bananinha"
            }

            await userBusiness.signup(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'name' deve ser string")
                expect(error.statusCode).toBe(400)
            }
        }
    })
    test("deve disparar erro caso email não for string", async () => {

        expect.assertions(2)

        try {
            const input = {
                name: "Example Mock",
                email: 25,
                password: "bananinha"
            }

            await userBusiness.signup(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'email' deve ser string")
                expect(error.statusCode).toBe(400)
            }
        }
    })
    test("deve disparar erro caso password não for string", async () => {

        expect.assertions(2)

        try {
            const input = {
                name: "Example Mock",
                email: "example@email.com",
                password: 25
            }

            await userBusiness.signup(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'password' deve ser string")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})