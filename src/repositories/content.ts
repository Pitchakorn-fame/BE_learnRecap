import { PrismaClient } from "@prisma/client";

interface ICreateContent {
  videoUrl: string;
  comment: string;
  rating: number;
  videoTitle: string;
  thumbnailUrl: string;
  creatorName: string;
  creatorUrl: string;
  userId: string;
}

interface IContent extends ICreateContent {
  id: number;
}

class RepositoryContent {
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
