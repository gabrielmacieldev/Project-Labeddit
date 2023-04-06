import { CommentBusiness } from "../../src/business/CommentBusiness"
import { CreateCommentsInputDTO, GetCommentInputDTO, LikeOrDislikeCommentInputDTO } from "../../src/dtos/commentDTO"
import { BadRequestError } from "../../src/error/BadRequestError"
import { CommentsDatabaseMock } from "../mocks/CommentDatabaseMock"
import { PostDatabaseMock } from "../mocks/PostDatabaseMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from '../mocks/UserDatabaseMock'

describe("LikeOrDislikeComment", () => {
    const commentBusiness = new CommentBusiness(
        new PostDatabaseMock(),
        new CommentsDatabaseMock(),
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("deve reagir a um post", async () => {

        const input: LikeOrDislikeCommentInputDTO = {
            idComment: "id-mock-comment",
            token: "token-mock",
            like: true
        }

        const response = await commentBusiness.likeOrDislikeComment(input)
        expect(response).toBe(undefined)
    })

    test("token inválido dispara erro", async () => {

        try {
            const input: LikeOrDislikeCommentInputDTO = {
                idComment: "id-mock-comment",
                token: undefined,
                like: true
            }

            await commentBusiness.likeOrDislikeComment(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token ausente")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar erro caso token seja inválido", async () => {

        expect.assertions(2)

        try {
            const input: LikeOrDislikeCommentInputDTO = {
                idComment: "id-mock-comment",
                token: "token-mock-errado",
                like: true
            }
            await commentBusiness.likeOrDislikeComment(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("like não boolean dispara erro", async () => {
        expect.assertions(2)

        try {
            const input: LikeOrDislikeCommentInputDTO = {
                idComment: "id-mock-comment",
                token: "token-mock-normal",
                like: "true"
            }

            await commentBusiness.likeOrDislikeComment(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'like' deve ser boolean")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})