import { UserInterface } from "./../interfaces/UserInterface";
import validator from "validator";

export class User implements UserInterface {
  id: number;
  username: string;
  password: string;
  email: string;
  nickname: string;

  constructor(user: UserInterface) {
    // this.id = user.id;
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
    this.nickname = user.nickname;

    // Validate email
    if (!validator.isEmail(this.email)) {
      throw new Error("Invalid email");
    }

    // Validate nickname
    if (!validator.isLength(this.nickname, { min: 3, max: 20 })) {
      throw new Error("Invalid nickname");
    }
  }
}
