"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = __importDefault(require("express"));
const PostBusiness_1 = require("../business/PostBusiness");
const PostController_1 = require("../controller/PostController");
const PostDatabase_1 = require("../database/PostDatabase");
const IdGenerator_1 = require("../services/IdGenerator");
const TokenManager_1 = require("../services/TokenManager");
exports.postsRouter = express_1.default.Router();
const postController = new PostController_1.PostController(new PostBusiness_1.PostBusiness(new PostDatabase_1.PostDatabase(), new IdGenerator_1.IdGenerator(), new TokenManager_1.TokenManager()));
exports.postsRouter.get("/", postController.getPosts);
exports.postsRouter.get("/:id", postController.getPostsById);
exports.postsRouter.post("/", postController.createPost);
exports.postsRouter.put("/:id", postController.editPosts);
exports.postsRouter.delete("/:id", postController.deletePosts);
exports.postsRouter.put("/:id/like", postController.likeOrDislikePost);
//# sourceMappingURL=postsRouter.js.map