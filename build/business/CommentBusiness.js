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
exports.CommentBusiness = void 0;
const BadRequestError_1 = require("../error/BadRequestError");
const NotFoundError_1 = require("../error/NotFoundError");
const Comment_1 = require("../models/Comment");
const types_1 = require("../types");
class CommentBusiness {
    constructor(postDatabase, commentDatabase, userDatabase, idGenerator, tokenManager) {
        this.postDatabase = postDatabase;
        this.commentDatabase = commentDatabase;
        this.userDatabase = userDatabase;
        this.idGenerator = idGenerator;
        this.tokenManager = tokenManager;
        this.getComments = (input) => __awaiter(this, void 0, void 0, function* () {
            const { token, post_id } = input;
            if (token === undefined) {
                throw new BadRequestError_1.BadRequestError("token ausente");
            }
            const payload = this.tokenManager.getPayload(token);
            if (payload === null) {
                throw new BadRequestError_1.BadRequestError("token inválido");
            }
            const commentsDB = yield this.commentDatabase.getAllComments(post_id);
            const users = yield this.userDatabase.getAllUsers();
            const comments = commentsDB.map((comment) => {
                const findUsers = users.find((user) => user.id === comment.creator_id);
                if (!findUsers) {
                    throw new NotFoundError_1.NotFoundError("Usuário não encontrado");
                }
                const creator = {
                    id: findUsers.id,
                    name: findUsers.name,
                    role: findUsers.role
                };
                const commentCreator = new Comment_1.Comment(comment.id, comment.content, comment.likes, comment.dislikes, comment.created_at, comment.updated_at, comment.post_id, creator);
                return commentCreator.toBusinessModel();
            });
            const output = comments;
            return output;
        });
        this.getCommentsByPostId = (input) => __awaiter(this, void 0, void 0, function* () {
            const { post_id, token } = input;
            if (token === undefined) {
                throw new BadRequestError_1.BadRequestError("ERRO: É preciso enviar um token.");
            }
            const tokenValid = this.tokenManager.getPayload(token);
            if (tokenValid === null) {
                throw new BadRequestError_1.BadRequestError("ERRO: O token é inválido.");
            }
            const commentsByPostIdDB = yield this.commentDatabase.getCommentsByPostId(post_id);
            let userWithComments = [];
            for (const comment of commentsByPostIdDB) {
                const userDB = yield this.commentDatabase.getUserById(comment.creator_id);
                const styleGetComment = {
                    id: comment.id,
                    creatorNickName: userDB.name,
                    comment: comment.content,
                    likes: comment.likes,
                    dislikes: comment.dislikes,
                };
                userWithComments.push(styleGetComment);
            }
            return userWithComments;
        });
        this.createComment = (input) => __awaiter(this, void 0, void 0, function* () {
            const { token, post_id, content } = input;
            if (!token) {
                throw new BadRequestError_1.BadRequestError("ERRO: O token precisa ser informado.");
            }
            if (typeof post_id !== "string") {
                throw new BadRequestError_1.BadRequestError("'post_id' não é uma string");
            }
            if (typeof content !== "string") {
                throw new BadRequestError_1.BadRequestError("'content' não é uma string");
            }
            if (token === undefined) {
                throw new BadRequestError_1.BadRequestError("ERRO: O token precisa ser informado.");
            }
            const payload = this.tokenManager.getPayload(token);
            if (payload === null) {
                throw new BadRequestError_1.BadRequestError("token inválido");
            }
            const findPostById = yield this.postDatabase.findById(post_id);
            if (!findPostById) {
                throw new BadRequestError_1.BadRequestError("'Post' não encontrado");
            }
            const id = this.idGenerator.generate();
            const createdAt = new Date().toISOString();
            const updatedAt = new Date().toISOString();
            const comment = new Comment_1.Comment(id, content, 0, 0, createdAt, updatedAt, post_id, payload);
            const commentDB = comment.toDBModel();
            yield this.commentDatabase.insert(commentDB);
            yield this.commentDatabase.updateCommentsNumber(id, 1);
        });
        this.likeOrDislikeComment = (input) => __awaiter(this, void 0, void 0, function* () {
            const { idComment, token, like } = input;
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
            const commentWithCreatorDB = yield this.commentDatabase
                .findCommentWithCreatorById(idComment);
            if (!commentWithCreatorDB) {
                throw new NotFoundError_1.NotFoundError("'id' não encontrado");
            }
            const userId = payload.id;
            const likeSQLite = like ? 1 : 0;
            const likeDislikeDB = {
                user_id: userId,
                comments_id: commentWithCreatorDB.id,
                like: likeSQLite
            };
            const creatorName = {
                id: payload.id,
                name: payload.name,
                role: payload.role
            };
            const comment = new Comment_1.Comment(commentWithCreatorDB.id, commentWithCreatorDB.content, commentWithCreatorDB.likes, commentWithCreatorDB.dislikes, commentWithCreatorDB.created_at, commentWithCreatorDB.updated_at, commentWithCreatorDB.post_id, creatorName);
            const likeDislikeExists = yield this.commentDatabase
                .findCommentLikeDislike(likeDislikeDB);
            if (likeDislikeExists === types_1.COMMENT_LIKE.ALREADY_LIKED) {
                if (like) {
                    yield this.commentDatabase.removeLikeDislike(likeDislikeDB);
                    comment.removeLike();
                }
                else {
                    yield this.commentDatabase.updateLikeDislike(likeDislikeDB);
                    comment.removeLike();
                    comment.addDislike();
                }
            }
            else if (likeDislikeExists === types_1.COMMENT_LIKE.ALREADY_DISLIKED) {
                if (like) {
                    yield this.commentDatabase.updateLikeDislike(likeDislikeDB);
                    comment.removeDislike();
                    comment.addLike();
                }
                else {
                    yield this.commentDatabase.removeLikeDislike(likeDislikeDB);
                    comment.removeDislike();
                }
            }
            else {
                yield this.commentDatabase.likeOrDislikeComment(likeDislikeDB);
                like ? comment.addLike() : comment.addDislike();
            }
            const updatedCommentDB = comment.toDBModel();
            yield this.commentDatabase.update(idComment, updatedCommentDB);
        });
    }
}
exports.CommentBusiness = CommentBusiness;
//# sourceMappingURL=CommentBusiness.js.map