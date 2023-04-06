import { CommentBusiness } from "../../src/business/CommentBusiness"
import { CreateCommentsInputDTO, GetCommentInputDTO } from "../../src/dtos/commentDTO"
import { BadRequestError } from "../../src/error/BadRequestError"
import { CommentsDatabaseMock } from "../mocks/CommentDatabaseMock"
import { PostDatabaseMock } from "../mocks/PostDatabaseMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from '../mocks/UserDatabaseMock'

describe("createComment", () => {
    const commentBusiness = new CommentBusiness(
        new PostDatabaseMock(),
        new CommentsDatabaseMock(),
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("post bem-sucedido retorna true", async () => {
        const input: CreateCommentsInputDTO = {
            token: "token-mock-normal",
            post_id: "id do post",
            content: "Nova postagem!"
        }

        const response = await commentBusiness.createComment(input)
        expect(response).toBe(undefined)
    })

    test("deve disparar erro caso token não for retornado", async () => {

        expect.assertions(2)

        try {
            const input = {
                token: undefined,
                post_id: "id do post",
                content: "Nova postagem!"
            }

            await commentBusiness.createComment(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("ERRO: O token precisa ser informado.")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar erro caso post_id não for string", async () => {

        expect.assertions(2)

        try {
            const input = {
                token: "token-mock",
                post_id: 50,
                content: "Nova postagem!"
            }

            await commentBusiness.createComment(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'post_id' não é uma string")
                expect(error.statusCode).toBe(400)
            }
        }
    })
    test("deve disparar erro caso content não for string", async () => {

        expect.assertions(2)

        try {
            const input = {
                token: "token-mock",
                post_id: "number",
                content: 25
            }

            await commentBusiness.createComment(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'content' não é uma string")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("token null dispara erro", async () => {
        expect.assertions(2)

        try {
            const input: CreateCommentsInputDTO = {
                token: "token errado",
                post_id: "id do post",
                content: "Nova postagem!"
            }

            await commentBusiness.createComment(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("token inválido dispara erro", async () => {
        expect.assertions(2)

        try {
            const input: CreateCommentsInputDTO = {
                token: undefined,
                post_id: "id do post",
                content: "Nova postagem!"
            }

            await commentBusiness.createComment(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("ERRO: O token precisa ser informado.")
                expect(error.statusCode).toBe(400)
            }
        }
    })

})