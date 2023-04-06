"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const UserBusiness_1 = require("../business/UserBusiness");
const UserController_1 = require("../controller/UserController");
const UserDatabase_1 = require("../database/UserDatabase");
const HashManager_1 = require("../services/HashManager");
const IdGenerator_1 = require("../services/IdGenerator");
const TokenManager_1 = require("../services/TokenManager");
exports.usersRouter = express_1.default.Router();
const userController = new UserController_1.UserController(new UserBusiness_1.UserBusiness(new UserDatabase_1.UserDatabase(), new IdGenerator_1.IdGenerator(), new TokenManager_1.TokenManager(), new HashManager_1.HashManager()));
exports.usersRouter.post("/signup", userController.signup);
exports.usersRouter.post("/login", userController.login);
//# sourceMappingURL=usersRouter.js.map