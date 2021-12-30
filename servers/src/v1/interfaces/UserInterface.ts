export interface UserInterface {
  username: string;
  password: string;
  email: string;
  nickname: string;
}

export interface UserResponseInterface extends UserInterface {
  id: string;
}

export interface UserRequestInterface extends UserInterface {}
