import { PostBusiness } from "../../src/business/PostBusiness"
import { DeletePostInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/error/BadRequestError"
import { NotFoundError } from "../../src/error/NotFoundError"
import { PostDatabaseMock } from "../mocks/PostDatabaseMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"


describe("delete", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )
    
    test("teste de deletar um usuário", async () => {
        const input: DeletePostInputDTO = {
            idToDelete: "id-post-mock2",
            token: "token-mock-admin"
        }
        
        const response = await postBusiness.deletePost(input)       
        expect(response).toBeUndefined()
    })

    test("disparar erro se o token for inválido", async () => {
       
        try {
            const input: DeletePostInputDTO = {
                idToDelete: "id-mock-admin",
                token: "token-mock-admin-errado"
            }
    
            await postBusiness.deletePost(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("disparar erro se o id não existir", async () => {
        
        try {
            const input: DeletePostInputDTO = {
                idToDelete: "id-mock-errado",
                token: "token-mock-admin"
            }
    
            await postBusiness.deletePost(input)
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.message).toBe("'id' não encontrado")
                expect(error.statusCode).toBe(404)
            }
        }
    })

    test("dispara erro quando token for undefined", async () => {

        try {
            const input: DeletePostInputDTO = {
                idToDelete: "id-mock-errado",
                token: undefined
            }

            await postBusiness.deletePost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token ausente")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})