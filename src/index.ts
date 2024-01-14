import { PrismaClient } from "@prisma/client";
import { newRepositoryUser } from "./repositories/user";
import { newHandlerUser } from "./handlers/user";
import { createClient } from "redis";
import express from "express";
import { newRepositoryBlacklist } from "./repositories/blacklist";
import { newMiddlewareHandler } from "./auth/jwt";
import { newRepositoryContent } from "./repositories/content";
import { newHandlerContent } from "./handlers/content";

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

  const repoContent = newRepositoryContent(db);
  const handlerContent = newHandlerContent(repoContent);

  const port = process.env.PORT || 8000;

  // const express = require("express");
  const server = express();
  const userRouter = express.Router();
  const contentRouter = express.Router();

  server.use(express.json());
  server.use("/user", userRouter);
  server.use("/content", contentRouter);

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

  //content
  contentRouter.post(
    "/",
    middleware.jwtMiddleware.bind(middleware),
    handlerContent.createContent.bind(handlerContent)
  );

  server.listen(port, () => console.log(`server listening on ${port}`));
}

main();
