import { UserBusiness } from "../../src/business/UserBusiness"
import { LoginInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/error/BadRequestError"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("login", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )
    
    test("login bem-sucedido em conta normal retorna token", async () => {
        const input: LoginInputDTO = {
            email: "normal@email.com",
            password: "bananinha"
        }

        const response = await userBusiness.login(input)
        expect(response.token).toBe("token-mock-normal")
    })

    test("login bem-sucedido em conta admin retorna token", async () => {
        const input: LoginInputDTO = {
            email: "admin@email.com",
            password: "bananinha"
        }

        const response = await userBusiness.login(input)
        expect(response.token).toBe("token-mock-admin")
    })

    test("deve disparar erro caso email não for string", async () => {

        expect.assertions(2)

        try {
            const input = {
                name: "Example Mock",
                email: 25,
                password: "bananinha"
            }

            await userBusiness.login(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'email'deve ser uma string")
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

            await userBusiness.login(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'password' deve ser string")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})