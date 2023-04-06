import { PostBusiness } from "../../src/business/PostBusiness"
import { LikeOrDislikeInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/error/BadRequestError"
import { PostDatabaseMock } from "../mocks/PostDatabaseMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"


describe("LikeOrDislikePost", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("deve reagir a um post", async () => {

        const input: LikeOrDislikeInputDTO = {
            idToLikeOrDislike: "id-mock",
            token: "token-mock-normal",
            like: true
        }

        const response = await postBusiness.likeOrDislikePost(input)
        expect(response).toBeUndefined()
    })

    test("token inválido dispara erro", async () => {
        
        try {
            const input: LikeOrDislikeInputDTO = {
                idToLikeOrDislike: "id-post-mock",
                token: undefined,
                like: true
            }
    
            await postBusiness.likeOrDislikePost(input)
            
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token ausente")
                expect(error.statusCode).toBe(400)
            }
        }       
    })

    test("like não boolean dispara erro", async () => {
        expect.assertions(2)

        try {
            const input: LikeOrDislikeInputDTO = {
                idToLikeOrDislike: "id-post-mock",
                token: "token-mock-normal",
                like: "true"
            }
    
            await postBusiness.likeOrDislikePost(input)
            
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'like' deve ser boolean")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar erro caso token seja inválido", async () => {

        expect.assertions(2)

        try {
            const input: LikeOrDislikeInputDTO = {
                idToLikeOrDislike: "id-post-mock",
                token: "token-mock-errado",
                like: "true"
            }
            await postBusiness.likeOrDislikePost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})