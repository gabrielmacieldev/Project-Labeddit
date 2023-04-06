import { BaseDatabase } from "../../src/database/BaseDatabase"
import { CommentsDB, CommentWithCreatorDB, COMMENT_LIKE, LikesDislikesCommentsDB, UserDB, USER_ROLES } from "../../src/types"


export class CommentsDatabaseMock extends BaseDatabase {
    public static TABLE_COMMENTS = "comments"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes_comments"
    public static TABLE_USERS = "users"

    public getCommentsWithCreators = async (): Promise<CommentWithCreatorDB[]> => {
        return [
            {
                id: "id-comment-mock",
                creator_id: "id-mock",
                post_id: "id-post-mock",
                content: "primeiro comment mock",
                likes: 0,
                dislikes: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                creator_name: "Normal Mock"
            },
            {
                id: "id-comment-mock",
                creator_id: "id-mock",
                post_id: "id-post-mock",
                content: "primeiro comment mock",
                likes: 0,
                dislikes: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                creator_name: "Normal Mock"
            }
        ]
    }

    public findCommentWithCreatorById = async (id: string): Promise<CommentWithCreatorDB | undefined> => {
        switch (id) {
            case "id-mock":
                return {
                    id: "id-comment-mock",
                    creator_id: "id-mock",
                    post_id: "id-post-mock",
                    content: "primeiro comment mock",
                    likes: 0,
                    dislikes: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    creator_name: "Normal Mock"
                }
            case "id-mock2":
                return {
                    id: "id-comment-mock",
                    creator_id: "id-mock",
                    post_id: "id-post-mock",
                    content: "primeiro comment mock",
                    likes: 0,
                    dislikes: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    creator_name: "Normal Mock"
                }
            default:
                return undefined
        }
    }

    public getAllComments = async (id: string): Promise<CommentsDB[]> => {

        return [
            {
                id: 'id-comment-mock',
                creator_id: 'id-mock',
                post_id: 'id-post-mock',
                content: "primeiro comment mock",
                likes: 0,
                dislikes: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 'id-comments-mock',
                creator_id: 'id-mock-mock',
                post_id: 'id-post-mock',
                content: "primeiro comment mock",
                likes: 0,
                dislikes: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ]
    }

    public insert = async (newCommentsDB: CommentsDB): Promise<void> => {
    }

    public getCommentsByPostId = async (id: string): Promise<CommentsDB[]> => {

        return [
            {
                id: "id-comment-mock",
                creator_id: "id-mock",
                post_id: "id-post-mock",
                content: "primeiro comment mock",
                likes: 0,
                dislikes: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: "id-comment-mock",
                creator_id: "id-mock",
                post_id: "id-post-mock",
                content: "primeiro comment mock",
                likes: 0,
                dislikes: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
        ]
    }

    public async getUserById(id: string): Promise<UserDB> {

        if (id === "id-mock") {
            return {
                id: "id-mock",
                name: "Normal Mock",
                email: "normal@email.com",
                password: "hash-bananinha",
                role: USER_ROLES.NORMAL,
                created_at: new Date().toISOString()
            }
        } else {
            return {
                id: "id-mock",
                name: "Admin Mock",
                email: "admin@email.com",
                password: "hash-bananinha",
                created_at: new Date().toISOString(),
                role: USER_ROLES.ADMIN
            }
        }
    }

    public getCommentById = async (id: string): Promise<CommentsDB | undefined> => {
        switch (id) {
            case "id-comment-mock":
                return {
                    id: "id-comment-mock",
                    creator_id: "id-mock",
                    post_id: "id-post-mock",
                    content: "primeiro comment mock",
                    likes: 0,
                    dislikes: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            case "id-comment-mock2":
                return {
                    id: "id-comment-mock",
                    creator_id: "id-mock",
                    post_id: "id-post-mock",
                    content: "primeiro comment mock",
                    likes: 0,
                    dislikes: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            default:
                return undefined
        }
    }

    public updateCommentsNumber = async (id: string, value: number): Promise<void> => {
    }

    public findCommentLikeDislike = async (likeOrDislikeDBToFind: LikesDislikesCommentsDB): Promise<COMMENT_LIKE | null> => {

        if (likeOrDislikeDBToFind) {
            return likeOrDislikeDBToFind.like === 1
                ? COMMENT_LIKE.ALREADY_LIKED
                : COMMENT_LIKE.ALREADY_DISLIKED

        } else {
            return null
        }
    }

    public removeLikeDislike = async (likeOrDislike: LikesDislikesCommentsDB): Promise<void> => {
    }

    public updateLikeDislike = async (likeOrDislike: LikesDislikesCommentsDB): Promise<void> => {
    }

    public likeOrDislikeComment = async (likeOrDislike: LikesDislikesCommentsDB): Promise<void> => {
    }

    public update = async (id: string,
        commentDB: CommentsDB): Promise<void> => {
    }


}