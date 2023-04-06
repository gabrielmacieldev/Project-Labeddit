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
exports.UserBusiness = void 0;
const BadRequestError_1 = require("../error/BadRequestError");
const NotFoundError_1 = require("../error/NotFoundError");
const User_1 = require("../models/User");
const types_1 = require("../types");
class UserBusiness {
    constructor(userDatabase, idGenerator, tokenManager, hashManager) {
        this.userDatabase = userDatabase;
        this.idGenerator = idGenerator;
        this.tokenManager = tokenManager;
        this.hashManager = hashManager;
        this.signup = (input) => __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = input;
            if (typeof name !== "string") {
                throw new BadRequestError_1.BadRequestError("'name' deve ser string");
            }
            if (typeof email !== "string") {
                throw new BadRequestError_1.BadRequestError("'email' deve ser string");
            }
            if (typeof password !== "string") {
                throw new BadRequestError_1.BadRequestError("'password' deve ser string");
            }
            const userDBExists = yield this.userDatabase.findUserEmail(email);
            if (userDBExists) {
                throw new NotFoundError_1.NotFoundError("'email' ja existe");
            }
            const id = this.idGenerator.generate();
            const hashPassword = yield this.hashManager.hash(password);
            const role = types_1.USER_ROLES.NORMAL;
            const createdAt = new Date().toISOString();
            const newUser = new User_1.User(id, name, email, hashPassword, role, createdAt);
            const newUserDB = newUser.toDBModel();
            yield this.userDatabase.insertUser(newUserDB);
            const payload = {
                id: newUser.getId(),
                name: newUser.getName(),
                role: newUser.getRole()
            };
            const token = this.tokenManager.createToken(payload);
            const output = {
                token
            };
            return output;
        });
        this.login = (input) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = input;
            if (typeof email !== "string") {
                throw new BadRequestError_1.BadRequestError("'email'deve ser uma string");
            }
            if (typeof password !== "string") {
                throw new BadRequestError_1.BadRequestError("'password' deve ser string");
            }
            const searchUserDB = yield this.userDatabase.findUserEmail(email);
            if (!searchUserDB) {
                throw new NotFoundError_1.NotFoundError("'email' não encontrado");
            }
            const users = new User_1.User(searchUserDB.id, searchUserDB.name, searchUserDB.email, searchUserDB.password, searchUserDB.role, searchUserDB.created_at);
            const hashPassword = users.getPassword();
            const correctPassword = yield this.hashManager.compare(password, hashPassword);
            if (!correctPassword) {
                throw new NotFoundError_1.NotFoundError("'email' ou 'password' incorretos");
            }
            const payload = {
                id: users.getId(),
                name: users.getName(),
                role: users.getRole()
            };
            const token = this.tokenManager.createToken(payload);
            const output = {
                token
            };
            return output;
        });
    }
}
exports.UserBusiness = UserBusiness;
//# sourceMappingURL=UserBusiness.js.map