import express  from "express"
import { CommentBusiness } from "../business/CommentBusiness"
import { CommentController } from "../controller/CommentController"
import { CommentDatabase } from "../database/CommentDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { UserDatabase } from "../database/UserDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export const commentsRouter = express.Router()

const commentController = new CommentController(
    new CommentBusiness(
        new PostDatabase(),
        new CommentDatabase,
        new UserDatabase(),
        new IdGenerator(),
        new TokenManager()
    )
)

commentsRouter.get("/:id", commentController.getComments)
commentsRouter.get("/post/:id", commentController.getCommentsByPostId)
commentsRouter.post("/:id", commentController.createComments)
commentsRouter.put("/:id/like", commentController.likeOrDislikeComments)