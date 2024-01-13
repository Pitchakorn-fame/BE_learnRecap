"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const user_1 = require("./repositories/user");
const user_2 = require("./handlers/user");
async function main() {
    const db = new client_1.PrismaClient();
    const repoUser = (0, user_1.newRepositoryUser)(db);
    const handlerUser = (0, user_2.newHandlerUser)(repoUser);
    const port = process.env.PORT || 8000;
    const express = require("express");
    const userRouter = express.Router();
    const server = express();
    server.use(express.json());
    server.use("/user", userRouter);
    server.get("/", (_, res) => {
        return res.status(200).json({ status: "ok" }).end();
    });
    //user
    userRouter.post("/register", handlerUser.register.bind(handlerUser));
    userRouter.post("/login", handlerUser.login.bind(handlerUser));
    server.listen(port, () => console.log(`server listening on ${port}`));
}
main();
//# sourceMappingURL=index.js.map