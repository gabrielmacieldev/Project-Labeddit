import { PostBusiness } from "../../src/business/PostBusiness"
import { GetPostInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/error/BadRequestError"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { PostDatabaseMock } from "../mocks/PostDatabaseMock"

describe("getPost", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("deve retornar uma lista de posts", async () => {
        expect.assertions(2)
        
        const input: GetPostInputDTO = {
            token: "token-mock-normal"
        }

        const response = await postBusiness.getPosts(input)
        expect(response).toHaveLength(1)
        expect(response).toContainEqual({
            id: "id-mock",
            content: "Contéudo do post",
            likes: 1,
            dislikes: 0,
            comments: 1,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            creator : {
                id: "id-mock",
                name: "Creator Mock"
            }
        })
    })

    test("dispara erro se o token for inválido", async () => {

        try {
            const input: GetPostInputDTO = {
                token: undefined
            }

            await postBusiness.getPosts(input)
            
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token ausente")
                expect(error.statusCode).toBe(400)
            }
        }
        
        
    })
})