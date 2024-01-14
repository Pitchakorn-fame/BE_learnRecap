import { PrismaClient } from "@prisma/client";
import { IContent, ICreateContent } from "../entities/intex";
import { IRepositoryContent } from ".";

export function newRepositoryContent(db: PrismaClient): IRepositoryContent {
  return new RepositoryContent(db);
}
class RepositoryContent implements IRepositoryContent {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createContent(content: ICreateContent): Promise<IContent> {
    return await this.db.content.create({
      data: {
        ...content,
        userId: undefined,
        postedBy: { connect: { id: content.userId } },
      },
      include: {
        postedBy: {
          select: {
            id: true,
            username: true,
            name: true,
            registeredAt: true,
          },
        },
      },
    });
  }
}
