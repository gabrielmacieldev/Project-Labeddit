import { BaseDatabase } from "../../src/database/BaseDatabase"
import { PostDB, PostWithCreatorDB, POST_LIKE, USER_ROLES, LikesDislikesPostsDB, UserDB } from "../../src/types"
import { PostDatabase } from "../../src/database/PostDatabase"
import { UserDatabase } from '../../src/database/UserDatabase'

export class PostDatabaseMock extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_USERS = "users"

    private userDatabase: UserDatabase = new UserDatabase()

    public getPostsWithCreators = async (): Promise<PostWithCreatorDB[]> => {

        return [
            {
                id: "id-mock",
                creator_id: "creator-id-mock",
                content: "Contéudo do post",
                likes: 1,
                dislikes: 0,
                comments: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                creator_name: "Creator Mock"
            }
        ]
    }

    public insert = async (newPostDB: PostDB): Promise<void> => {
    }

    public async getUserById(id: string): Promise<UserDB> {
        let result: UserDB = {
            id: "",
            name: "",
            email: "",
            password: "",
            role: USER_ROLES.NORMAL,
            created_at: ""
        };

        switch (id) {
            case "id-mock-normal":
                result = {
                    id: "id-mock-normal",
                    name: "Normal Mock",
                    email: "normal@example.com",
                    password: "hash-backend",
                    role: USER_ROLES.NORMAL,
                    created_at: new Date().toISOString()
                };
                break;
            case "id-mock-admin":
                result = {
                    id: "id-mock-admin",
                    name: "Admin Mock",
                    email: "admin@example.com",
                    password: "hash-backend",
                    role: USER_ROLES.ADMIN,
                    created_at: new Date().toISOString()
                };
                break;
        }

        return result;
    }

    public async getPostById(id: string): Promise<PostWithCreatorDB | undefined> {

        const posts: PostWithCreatorDB[] = [{
            id: "id-mock",
            creator_id: "id-mock",
            content: "Content of post 1",
            comments: 0,
            likes: 1,
            dislikes: 1,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            creator_name: "John Dep"
        }, {
            id: "id-mock",
            creator_id: "id-mock",
            content: "Content of post 2",
            comments: 0,
            likes: 1,
            dislikes: 1,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            creator_name: "John Dep"
        }]
        const post = posts.filter((element) => element.id === id)

        return post[0]
    }

    public findById = async (id: string): Promise<PostDB | undefined> => {
        return {
            id: "id-mock-post",
            creator_id: "id-mock",
            content: "realizando testes",
            comments: 0,
            likes: 1,
            dislikes: 2,
            created_at: expect.any(String),
            updated_at: expect.any(String)
        }
    }
    public update = async (idToEdit: string, newPostDB: PostDB): Promise<void> => {
    }

    public delete = async (idToDelete: string): Promise<void> => {
    }

    public findPostWithCreatorById = async (postId: string): Promise<PostWithCreatorDB | undefined> => {
        switch (postId) {
            case "p001":
                return {
                    id: "id-mock",
                    creator_id: "creator-id-mock",
                    content: "Contéudo do post",
                    likes: 1,
                    dislikes: 0,
                    comments: 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    creator_name: "Creator Mock"
                }
            default:
                return undefined
        }
    }
    public likeOrDislikePost = async (likeDislike: LikesDislikesPostsDB): Promise<void> => {
    }

    public findLikeDislike = async (likeDislikeToFind: LikesDislikesPostsDB): Promise<POST_LIKE | null> => {
        if (likeDislikeToFind) {
            const likeDislikeDB = {
                user_id: "string",
                post_id: "string",
                like: 1
            }

            return likeDislikeDB.like === 1 ? POST_LIKE.ALREADY_LIKED : POST_LIKE.ALREADY_DISLIKED
        } else {
            return null
        }
    }

    public removeLikeDislike = async (likeDislike: LikesDislikesPostsDB): Promise<void> => {
    }

    public updateLikeDislike = async (likeDislike: LikesDislikesPostsDB): Promise<void> => {
    }
}