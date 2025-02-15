/**
 * Representing user model contains in database.
 */
export interface UserInterface {
  username: string;
  password: string;
  email: string;
  nickname: string;
  introduction: string;
}

/**
 * A hierarchy of user response.
 */
export interface UserResponseInterface extends UserInterface {
  id?: number;
}

export interface UsersResponseInterface extends Array<UserInterface> {}

/**
 *
 */
export interface UserRequestInterface extends UserInterface {}

/**
 * Interface represents the user model when requesting a user from client to server.
 */
export interface UserRequestSignInInterface {
  username: string;
  password: string;
}
