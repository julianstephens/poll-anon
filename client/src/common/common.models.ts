export interface IFormInput {
  name?: string;
  email: string;
  password: string;
}

export interface IAuthResp {
  token: string;
  user: IUser;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  polls?: IPoll[];
  starredPolls?: number[];
}

export interface IPoll {
  id: number;
  slug: string;
  title: string;
  desc?: string;
  expDate?: number;
  showResults?: number;
  ownerId?: number;
  items?: IItem[];
}

export interface IItem {
  id: number;
  name: string;
}

export interface IAuthResp {
  token: string;
  user: IUser;
}