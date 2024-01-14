import { Response } from "express";
import { JwtAuthRequest } from "../auth/jwt";
import { Empty, IHandlerContent, WithContent } from ".";
import { getVideoDetails } from "../domian/services/oembed";
import { IRepositoryContent } from "../repositories";

export function newHandlerContent(
  repoContent: IRepositoryContent
): IHandlerContent {
  return new HandlerContent(repoContent);
}
class HandlerContent implements IHandlerContent {
  private repoContent: IRepositoryContent;

  constructor(repoContent: IRepositoryContent) {
    this.repoContent = repoContent;
  }

  async createContent(
    req: JwtAuthRequest<Empty, WithContent>,
    res: Response
  ): Promise<Response> {
    const content: WithContent = req.body;

    if (!content.videoUrl || !content.comment || !content.rating) {
      return res
        .status(400)
        .json({ error: "missing information", statusCode: 400 })
        .end();
    }

    const userId = req.payload.id;
    const details = await getVideoDetails(content.videoUrl);

    return this.repoContent
      .createContent({ ...content, userId, ...details })
      .then((content) => res.status(201).json(content).end())
      .catch((err) => {
        console.error(`failed to create content: ${err}`);
        return res
          .status(500)
          .json({ error: `failed to create content: ${err}`, statusCode: 500 })
          .end();
      });
  }
}
