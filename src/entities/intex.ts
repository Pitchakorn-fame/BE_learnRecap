export interface ICreateUser {
  username: string;
  name: string;
  password: string;
}

export interface IUser extends ICreateUser {
  id: string;
}

export interface ICreateContent {
  videoUrl: string;
  comment: string;
  rating: number;
  videoTitle: string;
  thumbnailUrl: string;
  creatorName: string;
  creatorUrl: string;
  userId: string;
}

export interface IContent extends ICreateContent {
  id: number;
}
