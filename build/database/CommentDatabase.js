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
exports.CommentDatabase = void 0;
const NotFoundError_1 = require("../error/NotFoundError");
const types_1 = require("../types");
const BaseDatabase_1 = require("./BaseDatabase");
const PostDatabase_1 = require("./PostDatabase");
class CommentDatabase extends BaseDatabase_1.BaseDatabase {
    constructor() {
        super(...arguments);
        this.getCommentsWithCreators = () => __awaiter(this, void 0, void 0, function* () {
            const result = yield BaseDatabase_1.BaseDatabase
                .connection(CommentDatabase.TABLE_COMMENTS)
                .select("comments.id", "comments.creator_id", "comments.post_id", "comments.content", "comments.likes", "comments.dislikes", "comments.created_at", "comments.updated_at", "users.name AS creator_name")
                .join("users", "comments.creator_id", "=", "users.id");
            return result;
        });
        this.findCommentWithCreatorById = (commentId) => __awaiter(this, void 0, void 0, function* () {
            const result = yield BaseDatabase_1.BaseDatabase
                .connection(CommentDatabase.TABLE_COMMENTS)
                .select("comments.id", "comments.creator_id", "comments.post_id", "comments.content", "comments.likes", "comments.dislikes", "comments.created_at", "comments.updated_at", "users.name AS creator_name")
                .join("users", "comments.creator_id", "=", "users.id")
                .where("comments.id", commentId);
            return result[0];
        });
        this.getAllComments = (id) => __awaiter(this, void 0, void 0, function* () {
            return yield BaseDatabase_1.BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
                .where({ post_id: id });
        });
        this.insert = (commentDB) => __awaiter(this, void 0, void 0, function* () {
            yield BaseDatabase_1.BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
                .insert(commentDB);
        });
        this.getCommentsByPostId = (id) => __awaiter(this, void 0, void 0, function* () {
            const result = yield BaseDatabase_1.BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
                .where({ post_id: id });
            return result;
        });
        this.getCommentById = (id) => __awaiter(this, void 0, void 0, function* () {
            const [comment] = yield BaseDatabase_1.BaseDatabase
                .connection(CommentDatabase.TABLE_COMMENTS)
                .where({ id });
            return comment;
        });
        this.findCommentLikeDislike = (likeDislikeDBToFind) => __awaiter(this, void 0, void 0, function* () {
            const [likeDislikeDB] = yield BaseDatabase_1.BaseDatabase
                .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
                .select()
                .where({
                user_id: likeDislikeDBToFind.user_id,
                comments_id: likeDislikeDBToFind.comments_id
            });
            if (likeDislikeDB) {
                return likeDislikeDB.like === 1
                    ? types_1.COMMENT_LIKE.ALREADY_LIKED
                    : types_1.COMMENT_LIKE.ALREADY_DISLIKED;
            }
            else {
                return null;
            }
        });
        this.removeLikeDislike = (likeDislikeDB) => __awaiter(this, void 0, void 0, function* () {
            yield BaseDatabase_1.BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES)
                .delete()
                .where({
                user_id: likeDislikeDB.user_id,
                comments_id: likeDislikeDB.comments_id
            });
        });
        this.updateLikeDislike = (likeDislikeDB) => __awaiter(this, void 0, void 0, function* () {
            yield BaseDatabase_1.BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES)
                .update(likeDislikeDB)
                .where({
                user_id: likeDislikeDB.user_id,
                comments_id: likeDislikeDB.comments_id
            });
        });
        this.likeOrDislikeComment = (likeDislike) => __awaiter(this, void 0, void 0, function* () {
            yield BaseDatabase_1.BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES)
                .insert(likeDislike);
        });
        this.update = (id, commentDB) => __awaiter(this, void 0, void 0, function* () {
            yield BaseDatabase_1.BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
                .update(commentDB)
                .where({ id });
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield BaseDatabase_1.BaseDatabase
                .connection(CommentDatabase.TABLE_USERS)
                .select()
                .where({ id });
            return result[0];
        });
    }
    updateCommentsNumber(id, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.getCommentById(id);
            if (!comment) {
                throw new NotFoundError_1.NotFoundError("Comment não encontrado");
            }
            const [post] = yield BaseDatabase_1.BaseDatabase
                .connection(PostDatabase_1.PostDatabase.TABLE_POSTS)
                .where({ id: comment.post_id });
            if (!post) {
                throw new NotFoundError_1.NotFoundError("Post não encontrado");
            }
            const newCommentsCount = post.comments + value;
            yield BaseDatabase_1.BaseDatabase
                .connection(PostDatabase_1.PostDatabase.TABLE_POSTS)
                .where({ id: comment.post_id })
                .update({ comments: newCommentsCount });
        });
    }
}
exports.CommentDatabase = CommentDatabase;
CommentDatabase.TABLE_COMMENTS = "comments";
CommentDatabase.TABLE_LIKES_DISLIKES = "likes_dislikes_comments";
CommentDatabase.TABLE_USERS = "users";
//# sourceMappingURL=CommentDatabase.js.map