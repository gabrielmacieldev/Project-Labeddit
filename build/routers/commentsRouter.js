"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = __importDefault(require("express"));
const CommentBusiness_1 = require("../business/CommentBusiness");
const CommentController_1 = require("../controller/CommentController");
const CommentDatabase_1 = require("../database/CommentDatabase");
const PostDatabase_1 = require("../database/PostDatabase");
const UserDatabase_1 = require("../database/UserDatabase");
const IdGenerator_1 = require("../services/IdGenerator");
const TokenManager_1 = require("../services/TokenManager");
exports.commentsRouter = express_1.default.Router();
const commentController = new CommentController_1.CommentController(new CommentBusiness_1.CommentBusiness(new PostDatabase_1.PostDatabase(), new CommentDatabase_1.CommentDatabase, new UserDatabase_1.UserDatabase(), new IdGenerator_1.IdGenerator(), new TokenManager_1.TokenManager()));
exports.commentsRouter.get("/:id", commentController.getComments);
exports.commentsRouter.get("/post/:id", commentController.getCommentsByPostId);
exports.commentsRouter.post("/:id", commentController.createComments);
exports.commentsRouter.put("/:id/like", commentController.likeOrDislikeComments);
//# sourceMappingURL=commentsRouter.js.map