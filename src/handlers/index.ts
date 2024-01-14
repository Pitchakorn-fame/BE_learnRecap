import { Request, Response } from "express";
import { ICreateUser } from "../entities/intex";
import { JwtAuthRequest } from "../auth/jwt";

export interface AppRequest<Params, Body> extends Request<Params, any, Body> {}

export interface Empty {}

export type HandlerFunc<Req> = (req: Req, res: Response) => Promise<Response>;

export interface IHandlerUser {
  register: HandlerFunc<AppRequest<Empty, ICreateUser>>;
  login: HandlerFunc<AppRequest<Empty, ICreateUser>>;
  logout: HandlerFunc<JwtAuthRequest<Empty, Empty>>;
}

export interface WithContent {
  videoUrl: string;
  comment: string;
  rating: number;
}

export interface IHandlerContent {
  createContent: HandlerFunc<JwtAuthRequest<Empty, WithContent>>;
}
