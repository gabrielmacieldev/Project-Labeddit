import express  from "express"
import {PostBusiness} from '../business/PostBusiness'
import { PostController } from "../controller/PostController"
import { PostDatabase } from "../database/PostDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export const postsRouter = express.Router()

const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager()
    )
)

postsRouter.get("/", postController.getPosts)
postsRouter.get("/:id", postController.getPostsById)
postsRouter.post("/", postController.createPost)
postsRouter.put("/:id", postController.editPosts)
postsRouter.delete("/:id", postController.deletePosts)
postsRouter.put("/:id/like", postController.likeOrDislikePost)



