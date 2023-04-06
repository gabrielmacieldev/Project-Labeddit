"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostBusiness = void 0;
const BadRequestError_1 = require("../error/BadRequestError");
const NotFoundError_1 = require("../error/NotFoundError");
const Post_1 = require("../models/Post");
const types_1 = require("../types");
class PostBusiness {
    constructor(postDatabase, idGenerator, tokenManager) {
        this.postDatabase = postDatabase;
        this.idGenerator = idGenerator;
        this.tokenManager = tokenManager;
        this.getPosts = (input) => __awaiter(this, void 0, void 0, function* () {
            const { token } = input;
            if (token === undefined) {
                throw new BadRequestError_1.BadRequestError("token ausente");
            }
            const postWithCreatorsDB = yield this.postDatabase
                .getPostsWithCreators();
            const posts = postWithCreatorsDB.map((postWithCreatorDB) => {
                const post = new Post_1.Post(postWithCreatorDB.id, postWithCreatorDB.content, postWithCreatorDB.likes, postWithCreatorDB.dislikes, postWithCreatorDB.comments, postWithCreatorDB.created_at, postWithCreatorDB.updated_at, postWithCreatorDB.creator_id, postWithCreatorDB.creator_name);
                return post.toBusinessModel();
            });
            const output = posts;
            return output;
        });
        this.getPostById = (input) => __awaiter(this, void 0, void 0, function* () {
            const { id, token } = input;
            if (!token) {
                throw new BadRequestError_1.BadRequestError("ERRO: O token precisa ser informado.");
            }
            const tokenValid = this.tokenManager.getPayload(token);
            if (tokenValid === null) {
                throw new BadRequestError_1.BadRequestError("ERRO: O token é inválido.");
            }
            const savePostsbyIdDB = yield this.postDatabase.getPostById(id);
            if (!id) {
                throw new BadRequestError_1.BadRequestError("ERRO: O id não existe.");
            }
            if (!savePostsbyIdDB) {
                throw new BadRequestError_1.BadRequestError("ERRO: Post não encontrado.");
            }
            const instancePost = new Post_1.Post(savePostsbyIdDB.id, savePostsbyIdDB.content, savePostsbyIdDB.likes, savePostsbyIdDB.dislikes, savePostsbyIdDB.comments, savePostsbyIdDB.created_at, savePostsbyIdDB.updated_at, savePostsbyIdDB.creator_id, savePostsbyIdDB.creator_name);
            const postBusiness = instancePost.toBusinessModel();
            const idCreator = instancePost.getCreatorId();
            const userDB = yield this.postDatabase.getUserById(idCreator);
            const styleGetPost = Object.assign(Object.assign({}, postBusiness), { name: userDB.name });
            return styleGetPost;
        });
        this.createPost = (input) => __awaiter(this, void 0, void 0, function* () {
            const { token, content } = input;
            if (token === undefined) {
                throw new BadRequestError_1.BadRequestError("token ausente");
            }
            const payload = this.tokenManager.getPayload(token);
            if (payload === null) {
                throw new BadRequestError_1.BadRequestError("token inválido");
            }
            if (typeof content !== "string") {
                throw new BadRequestError_1.BadRequestError("'content' deve ser string");
            }
            const id = this.idGenerator.generate();
            const createdAt = new Date().toISOString();
            const updatedAt = new Date().toISOString();
            const creatorId = payload.id;
            const creatorName = payload.name;
            const post = new Post_1.Post(id, content, 0, 0, 0, createdAt, updatedAt, creatorId, creatorName);
            const postDB = post.toDBModel();
            yield this.postDatabase.insert(postDB);
        });
        this.editPost = (input) => __awaiter(this, void 0, void 0, function* () {
            const { idToEdit, token, content } = input;
            if (token === undefined) {
                throw new BadRequestError_1.BadRequestError("token ausente");
            }
            const payload = this.tokenManager.getPayload(token);
            if (payload === null) {
                throw new BadRequestError_1.BadRequestError("token inválido");
            }
            if (typeof content !== "string") {
                throw new BadRequestError_1.BadRequestError("'content' deve ser string");
            }
            const postDB = yield this.postDatabase.findById(idToEdit);
            if (!postDB) {
                throw new NotFoundError_1.NotFoundError("'id' não encontrado");
            }
            const creatorId = payload.id;
            if (postDB.creator_id !== creatorId) {
                throw new BadRequestError_1.BadRequestError("somente quem criou o post pode editar");
            }
            const creatorName = payload.name;
            const post = new Post_1.Post(postDB.id, postDB.content, postDB.likes, postDB.dislikes, postDB.comments, postDB.created_at, postDB.updated_at, creatorId, creatorName);
            post.setContent(content);
            post.setUpdateAt(new Date().toISOString());
            const updatedPostDB = post.toDBModel();
            yield this.postDatabase.update(idToEdit, updatedPostDB);
        });
        this.deletePost = (input) => __awaiter(this, void 0, void 0, function* () {
            const { idToDelete, token } = input;
            if (token === undefined) {
                throw new BadRequestError_1.BadRequestError("token ausente");
            }
            const payload = this.tokenManager.getPayload(token);
            if (payload === null) {
                throw new BadRequestError_1.BadRequestError("token inválido");
            }
            const postDB = yield this.postDatabase.findById(idToDelete);
            if (!postDB) {
                throw new NotFoundError_1.NotFoundError("'id' não encontrado");
            }
            const creatorId = payload.id;
            if (payload.role !== types_1.USER_ROLES.ADMIN
                && postDB.creator_id !== creatorId) {
                throw new BadRequestError_1.BadRequestError("somente Admin ou quem criou o post pode deletá-lo");
            }
            yield this.postDatabase.delete(idToDelete);
        });
        this.likeOrDislikePost = (input) => __awaiter(this, void 0, void 0, function* () {
            const { idToLikeOrDislike, token, like } = input;
            if (token === undefined) {
                throw new BadRequestError_1.BadRequestError("token ausente");
            }
            const payload = this.tokenManager.getPayload(token);
            if (payload === null) {
                throw new BadRequestError_1.BadRequestError("token inválido");
            }
            if (typeof like !== "boolean") {
                throw new BadRequestError_1.BadRequestError("'like' deve ser boolean");
            }
            const postWithCreatorDB = yield this.postDatabase
                .findPostWithCreatorById(idToLikeOrDislike);
            if (!postWithCreatorDB) {
                throw new NotFoundError_1.NotFoundError("'id' não encontrado");
            }
            const userId = payload.id;
            const likeSQLite = like ? 1 : 0;
            const likeDislikeDB = {
                user_id: userId,
                post_id: postWithCreatorDB.id,
                like: likeSQLite
            };
            const post = new Post_1.Post(postWithCreatorDB.id, postWithCreatorDB.content, postWithCreatorDB.likes, postWithCreatorDB.dislikes, postWithCreatorDB.comments, postWithCreatorDB.created_at, postWithCreatorDB.updated_at, postWithCreatorDB.creator_id, postWithCreatorDB.creator_name);
            const likeDislikeExists = yield this.postDatabase
                .findLikeDislike(likeDislikeDB);
            if (likeDislikeExists === types_1.POST_LIKE.ALREADY_LIKED) {
                if (like) {
                    yield this.postDatabase.removeLikeDislike(likeDislikeDB);
                    post.removeLike();
                }
                else {
                    yield this.postDatabase.updateLikeDislike(likeDislikeDB);
                    post.removeLike();
                    post.addDislike();
                }
            }
            else if (likeDislikeExists === types_1.POST_LIKE.ALREADY_DISLIKED) {
                if (like) {
                    yield this.postDatabase.updateLikeDislike(likeDislikeDB);
                    post.removeDislike();
                    post.addLike();
                }
                else {
                    yield this.postDatabase.removeLikeDislike(likeDislikeDB);
                    post.removeDislike();
                }
            }
            else {
                yield this.postDatabase.likeOrDislikePost(likeDislikeDB);
                like ? post.addLike() : post.addDislike();
            }
            const updatedPlaylistDB = post.toDBModel();
            yield this.postDatabase.update(idToLikeOrDislike, updatedPlaylistDB);
        });
    }
}
exports.PostBusiness = PostBusiness;
//# sourceMappingURL=PostBusiness.js.map