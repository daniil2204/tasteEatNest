export interface userRegisterInterface {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface userSighInInterface {
  email: string;
  password: string;
}

export type UserInterceptorType = {
  name: string;
  id: number;
};
