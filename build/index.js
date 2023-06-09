"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const usersRouter_1 = require("./routers/usersRouter");
const postsRouter_1 = require("./routers/postsRouter");
const commentsRouter_1 = require("./routers/commentsRouter");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.listen(Number(process.env.PORT), () => {
    console.log(`Servidor rodando na porta ${Number(process.env.PORT)}`);
});
app.use("/users", usersRouter_1.usersRouter);
app.use("/posts", postsRouter_1.postsRouter);
app.use("/comments", commentsRouter_1.commentsRouter);
//# sourceMappingURL=index.js.map