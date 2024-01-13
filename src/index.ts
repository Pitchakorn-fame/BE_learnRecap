import { PrismaClient } from "@prisma/client";
import { newRepositoryUser } from "./repositories/user";
import { newHandlerUser } from "./handlers/user";
import { createClient } from "redis";
import { newRepositoryBlacklist } from "./repositories/blacklist";
import { newMiddlewareHandler } from "./auth/jwt";

async function main() {
  const db = new PrismaClient();
  const redis = createClient<any, any, any>();

  try {
    await redis.connect();
    await db.$connect();
  } catch (err) {
    console.log(err);
    return;
  }

  const repoUser = newRepositoryUser(db);
  const repoBlacklist = newRepositoryBlacklist(redis);
  const handlerUser = newHandlerUser(repoUser, repoBlacklist);

  const middleware = newMiddlewareHandler(repoBlacklist);

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
  userRouter.post(
    "/logout",
    middleware.jwtMiddleware.bind(middleware),
    handlerUser.logout.bind(handlerUser)
  );

  server.listen(port, () => console.log(`server listening on ${port}`));
}

main();
