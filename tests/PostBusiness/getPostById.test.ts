import { PostBusiness } from "../../src/business/PostBusiness";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { PostDatabaseMock } from "../mocks/PostDatabaseMock";
import { GetPostByIdInputDTO } from "../../src/dtos/userDTO";
import { BadRequestError } from "../../src/error/BadRequestError";

describe("getPostsById", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    );

    test("deve retornar um post pelo id", async () => {
        const input: GetPostByIdInputDTO = {
            id: "id-mock",
            token: "token-mock-normal"
        };

        const response = await postBusiness.getPostById(input);

        expect(response).toEqual({
            id: "id-mock",
            creator: {
                id: "id-mock",
                name: "John Dep"
            },
            content: "Content of post 1",
            comments: 0,
            likes: 1,
            dislikes: 1,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            name: ""
        });
    });

    test("deve disparar erro caso id não exista", async () => {
        
        expect.assertions(2)

        try {
            const input = {
                id: "",
                token: "token-mock-admin"
            }

            await postBusiness.getPostById(input)

        } catch (error) {
            if(error instanceof BadRequestError) {
                expect(error.message).toBe("ERRO: O id não existe.")
                expect(error.statusCode).toBe(400)
            }
        }     
    })

    test("deve disparar erro caso token seja inválido", async () => {

        expect.assertions(2)

        try {
            const input = {
                id: "id-mock",
                token: "token-incorreto"
            }
            await postBusiness.getPostById(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("ERRO: O token é inválido.")
                expect(error.statusCode).toBe(400)
            }
        }

    })

    test("deve disparar erro caso Post não for encontrado", async () => {
        
        expect.assertions(2)

        try {
            const input = {
                id: "20",
                token: "token-mock-admin"
            }

            await postBusiness.getPostById(input)

        } catch (error) {
            if(error instanceof BadRequestError) {
                expect(error.message).toBe("ERRO: Post não encontrado.")
                expect(error.statusCode).toBe(400)
            }
        }     
    })

    test("deve disparar erro caso token não for retornado", async () => {
        
        expect.assertions(2)

        try {
            const input = {
                id: "id-mock",
                token: undefined
            }

            await postBusiness.getPostById(input)

        } catch (error) {
            if(error instanceof BadRequestError) {
                expect(error.message).toBe("ERRO: O token precisa ser informado.")
                expect(error.statusCode).toBe(400)
            }
        }     
    })
});

