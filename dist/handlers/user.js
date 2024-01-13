"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newHandlerUser = void 0;
const bcrypt_1 = require("../auth/bcrypt");
function newHandlerUser(repo) {
    return new HandlerUser(repo);
}
exports.newHandlerUser = newHandlerUser;
class HandlerUser {
    constructor(repo) {
        this.repo = repo;
    }
    async register(req, res) {
        const userRegister = req.body;
        if (!userRegister.name ||
            !userRegister.username ||
            !userRegister.password) {
            return res
                .status(400)
                .json({ error: "missing information", statusCode: 400 })
                .end();
        }
        return this.repo
            .createUser({
            ...userRegister,
            password: (0, bcrypt_1.hashPassword)(userRegister.password),
        })
            .then((user) => res
            .status(201)
            .json({ ...user, password: undefined })
            .end())
            .catch((err) => res
            .status(500)
            .json({
            error: `failed tp register user ${userRegister.username}: ${err}`,
            statusCode: 500,
        })
            .end());
    }
    async login(req, res) {
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ error: "missing username or password", statusCode: 400 })
                .end();
        }
        return this.repo
            .getUser(username)
            .then((user) => {
            if (!(0, bcrypt_1.compareHash)(password, user.password)) {
                return res
                    .status(401)
                    .json({ error: "invalid password", statusCode: 401 })
                    .end();
            }
            return res
                .status(201)
                .json({
                status: "logged in",
                user: { ...user, password: undefined },
                id: user.id,
            })
                .end();
        })
            .catch((err) => res
            .status(500)
            .json({ error: `failed to get user: ${err}`, statusCode: 500 })
            .end());
    }
}
//# sourceMappingURL=user.js.map