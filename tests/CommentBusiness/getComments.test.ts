import { CommentBusiness } from "../../src/business/CommentBusiness"
import { GetCommentInputDTO } from "../../src/dtos/commentDTO"
import { BadRequestError } from "../../src/error/BadRequestError"
import { CommentsDatabaseMock } from "../mocks/CommentDatabaseMock"
import { PostDatabaseMock } from "../mocks/PostDatabaseMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock} from '../mocks/UserDatabaseMock'

describe("getComment", () => {
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

            await commentBusiness.getComments(input)
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
            const input: GetCommentInputDTO = {
                token: "id-mock",
                post_id: "id-post-mock"
            }
            await commentBusiness.getComments(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token inválido")
                expect(error.statusCode).toBe(400)
            }
        }

    })
})