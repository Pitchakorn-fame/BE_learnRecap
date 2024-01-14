import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { JwtAuthRequest } from "../auth/jwt";
import { Empty } from ".";

export interface WithContent {
  videoUrl: string;
  comment: string;
  rating: number;
}

class HandlerContent {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createContent(
    req: JwtAuthRequest<Empty>,
    res: Response
  ): Promise<Response> {
    return;
  }
}
