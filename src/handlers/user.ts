import { Response } from "express";
import { IRepositoryBlacklist, IRepositoryUser } from "../repositories";
import { ICreateUser } from "../entities/intex";
import { compareHash, hashPassword } from "../auth/bcrypt";
import { JwtAuthRequest, Payload, newJwt } from "../auth/jwt";
import { AppRequest, Empty, IHandlerUser } from ".";

export function newHandlerUser(
  repo: IRepositoryUser,
  repoBlacklist: IRepositoryBlacklist
) {
  return new HandlerUser(repo, repoBlacklist);
}

class HandlerUser implements IHandlerUser {
  private repo: IRepositoryUser;
  private repoBlacklist: IRepositoryBlacklist;

  constructor(repo: IRepositoryUser, repoBlacklist: IRepositoryBlacklist) {
    this.repo = repo;
    this.repoBlacklist = repoBlacklist;
  }

  async register(
    req: AppRequest<Empty, ICreateUser>,
    res: Response
  ): Promise<Response> {
    const userRegister: ICreateUser = req.body;

    if (
      !userRegister.name ||
      !userRegister.username ||
      !userRegister.password
    ) {
      return res
        .status(400)
        .json({ error: "missing information", statusCode: 400 })
        .end();
    }
    return this.repo
      .createUser({
        ...userRegister,
        password: hashPassword(userRegister.password),
      })
      .then((user) =>
        res
          .status(201)
          .json({ ...user, password: undefined })
          .end()
      )
      .catch((err) =>
        res
          .status(500)
          .json({
            error: `failed to register user ${userRegister.username}: ${err}`,
            statusCode: 500,
          })
          .end()
      );
  }

  async login(
    req: AppRequest<Empty, ICreateUser>,
    res: Response
  ): Promise<Response> {
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
        if (!compareHash(password, user.password)) {
          return res
            .status(401)
            .json({ error: "invalid password", statusCode: 401 })
            .end();
        }

        const payload: Payload = { id: user.id, username: user.username };
        const accessToken = newJwt(payload);

        return res
          .status(201)
          .json({
            status: "logged in",
            user: { ...user, password: undefined },
            // id: user.id,
            accessToken,
          })
          .end();
      })
      .catch((err) => {
        console.error(`failed to get user: ${err}`);
        return res
          .status(500)
          .json({ error: `failed to get user: ${err}`, statusCode: 500 })
          .end();
      });
  }

  async logout(
    req: JwtAuthRequest<Empty, Empty>,
    res: Response
  ): Promise<Response> {
    return await this.repoBlacklist
      .addToBlacklist(req.token)
      .then(() =>
        res.status(201).json({ status: `logged out`, token: req.token }).end()
      )
      .catch((err) => {
        console.error(err);
        return res
          .status(500)
          .json({ error: `couldn't log out with token ${req.token}` })
          .end();
      });
  }
}
