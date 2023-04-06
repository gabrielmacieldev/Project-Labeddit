import { PostBusiness } from "../../src/business/PostBusiness"
import { BadRequestError } from "../../src/error/BadRequestError"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { PostDatabaseMock } from "../mocks/PostDatabaseMock"
import { CreatePostsInputDTO } from "../../src/dtos/userDTO"


describe("createPost", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("post bem-sucedido retorna true", async () => {
        const input: CreatePostsInputDTO = {
            content: "Nova postagem!",
            token: "token-mock-normal"
        }

        const response = await postBusiness.createPost(input)
        expect(response).toBe(undefined)
    })

    test("token null dispara erro", async () => {
        expect.assertions(2)

        try {
            const input: CreatePostsInputDTO = {
                content: "Nova postagem!",
                token: "token-mock"
            }
    
            await postBusiness.createPost(input)
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
            const input: CreatePostsInputDTO = {
                content: "Nova postagem!",
                token: undefined
            }
    
            await postBusiness.createPost(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token ausente")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("content diferente de string dispara erro", async () => {
        expect.assertions(2)

        try {
            const input: CreatePostsInputDTO = {
                content: null,
                token: "token-mock-normal"
            }
    
            await postBusiness.createPost(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'content' deve ser string")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})