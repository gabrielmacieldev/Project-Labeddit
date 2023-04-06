import { PostBusiness } from "../../src/business/PostBusiness"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { PostDatabaseMock } from "../mocks/PostDatabaseMock"
import { BadRequestError } from "../../src/error/BadRequestError"
import { EditPostInputDTO } from "../../src/dtos/userDTO"
import { NotFoundError } from "../../src/error/NotFoundError"
import { PostDatabase } from "../../src/database/PostDatabase"
import { PostDB } from "../../src/types"

describe("editPost", () => {
    const userBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    const postDatabase = new PostDatabase()

    test("dispara erro quando token for undefined", async () => {

        try {
            const input: EditPostInputDTO = {
                idToEdit: "id-mock-normal",
                token: undefined,
                content: "Novo post"
            }

            await userBusiness.editPost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token ausente")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("dispara erro quando content for undefined", async () => {

        try {
            const input: EditPostInputDTO = {
                idToEdit: "id-mock-normal",
                token: "token-mock-normal",
                content: undefined
            }

            await userBusiness.editPost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'content' deve ser string")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar erro caso token seja inválido", async () => {

        expect.assertions(2)

        try {
            const input: EditPostInputDTO = {
                idToEdit: "id-mock-normal",
                token: "token-incorreto",
                content: "not"
            }
            await userBusiness.editPost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

     test("verifica se o id é válido", async () => {
        try {
            const input: EditPostInputDTO = {
                idToEdit:"id-mock-normal",
                token:"token-mock-normal",
                content:"realizando testes"
            }

         await userBusiness.editPost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("ERRO: Id não encontrado.")
                expect(error.statusCode).toBe(404)
            }
        }
    })
})