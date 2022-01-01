import { TokenResponseInterface } from "./../interfaces/TokenInterface";

export class TokenResponse implements TokenResponseInterface {
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}
