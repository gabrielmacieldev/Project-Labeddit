import { CommentBusiness } from "../../src/business/CommentBusiness"
import { GetCommentInputDTO } from "../../src/dtos/commentDTO"
import { BadRequestError } from "../../src/error/BadRequestError"
import { CommentsDatabaseMock } from "../mocks/CommentDatabaseMock"
import { PostDatabaseMock } from "../mocks/PostDatabaseMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from '../mocks/UserDatabaseMock'

describe("getCommentsByPostId", () => {
    const commentBusiness = new CommentBusiness(
        new PostDatabaseMock(),
        new CommentsDatabaseMock(),
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("dispara erro se o token estiver ausente", async () => {
        expect.assertions(2)

        try {
            const input: GetCommentInputDTO = {
                token: undefined,
                post_id: "id-post-mock"
            }

            await commentBusiness.getCommentsByPostId(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("ERRO: É preciso enviar um token.")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar erro caso token seja inválido", async () => {

        expect.assertions(2)

        try {
            const input: GetCommentInputDTO = {
                token: "id-mock",
                post_id: "id-post-mock"
            }
            await commentBusiness.getCommentsByPostId(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("ERRO: O token é inválido.")
                expect(error.statusCode).toBe(400)
            }
        }

    })

    test("retorna os comentários por id", async () => {

        const input: GetCommentInputDTO = {
            token: "token-mock",
            post_id: "id-post-mock"
        }

        const response = await commentBusiness.getCommentsByPostId(input)
        expect(response).toEqual(
            [
                {
                    id: "id-mock-comments",
                    creatorNickName: "Normal mock",
                    comment: "teste",
                    likes: 2,
                    dislikes: 2
                }
            ]
        )
    })
})