import * as bcryptjs from "bcryptjs";
import { Tables } from "./../../v1/Database";
import {
  UserInterface,
  UserRequestInterface,
} from "./../../v1/interfaces/UserInterface";
import { User } from "./../../v1/classes/User";
import * as chai from "chai";
import { UserController } from "../../v1/controllers/UserController";
import DatabaseBuilder from "../../v1/utils/DatabaseBuilder";
import validator from "validator";
const expect = chai.expect;

const userFieldData = {
  username: "test",
  password: "test",
  email: "example@email.com",
  nickname: "test",
};

describe(`v1: User `, () => {
  describe(`Interface`, () => {
    it(`should be defined`, () => {
      expect(User).to.be.not.undefined;
    });

    it(`create user interface`, () => {
      const user = new User(userFieldData);

      // expect(user.id).to.be.equal(1);
      expect(user.username).to.be.equal(userFieldData.username);
      expect(user.password).to.be.equal(userFieldData.password);
      expect(user.email).to.be.equal(userFieldData.email);
      expect(user.nickname).to.be.equal(userFieldData.nickname);
    });
  });

  it(`create user request interface`, () => {
    const { username, password, email, nickname } = userFieldData;
    const user: UserRequestInterface = {
      username,
      password,
      email,
      nickname,
    };

    // expect not undefined
    expect(user).to.be.not.undefined;
    // expect user request
    expect(user.username).to.be.equal(userFieldData.username);
    expect(user.password).to.be.equal(userFieldData.password);
    expect(user.email).to.be.equal(userFieldData.email);
    expect(user.nickname).to.be.equal(userFieldData.nickname);
  });

  describe(`Controller`, () => {
    // remove user after create user
    afterEach(async () => {
      // delete user from database
      // by using truncate
      await DatabaseBuilder(Tables.User).truncate();
    });

    it(`should create new user`, async () => {
      const { username, password, email, nickname } = userFieldData;
      const response = await UserController.createUser(
        username,
        password,
        email,
        nickname
      );

      // select from database
      const responsesArray = await DatabaseBuilder(Tables.User)
        .select()
        .where({ id: response.id });
      // assertion
      expect(responsesArray).to.be.not.undefined;
      expect(responsesArray.length).to.be.equal(1);
      expect(responsesArray[0].username).to.be.equal(username);
      expect(responsesArray[0].email).to.be.equal(email);
      expect(responsesArray[0].nickname).to.be.equal(nickname);

      // check id as uuid
      expect(responsesArray[0].id).to.be.not.undefined;
      expect(responsesArray[0].id).to.be.a("string");
      expect(validator.isUUID(responsesArray[0].id), "uuid").to.be.true;

      // validate password as boolean (because it hashed lmao)
      expect(
        bcryptjs.compareSync(password, responsesArray[0].password),
        "password is not match or invalid"
      ).to.be.true;

      // delete user from database
      await DatabaseBuilder(Tables.User).delete().where({ id: response.id });
    });

    it(`should retrieves a user from the database`, async () => {
      // create user first
      const { username, password, email, nickname } = userFieldData;
      const response = await UserController.createUser(
        username,
        password,
        email,
        nickname
      );
      // make a select again to test again
      const responseUser = await UserController.getUserFromUUID(response.id);
      expect(responseUser).to.be.not.undefined;
      expect(responseUser.username).to.be.equal(username);
      expect(responseUser.email).to.be.equal(email);
      expect(responseUser.nickname).to.be.equal(nickname);
      // id must be a uuid
      expect(responseUser.id).to.be.not.undefined;
      // password hash confirm
      expect(
        bcryptjs.compareSync(password, responseUser.password),
        "password is not match or invalid"
      ).to.be.true;
    });

    it(`should true whether check has user from username`, async () => {
      const { username, password, email, nickname } = userFieldData;
      const response = await UserController.createUser(
        username,
        password,
        email,
        nickname
      );
      const responseUser = await UserController.hasUserByUsername(username);
      expect(responseUser).to.be.true;
    });

    it(`should true whether check has user from uuid`, async () => {
      const { username, password, email, nickname } = userFieldData;
      const response = await UserController.createUser(
        username,
        password,
        email,
        nickname
      );
      const responseUser = await UserController.hasUserByUUID(response.id);
      expect(responseUser).to.be.true;
    });

    // missing arguments for all functions above
    it(`should throw error when missing arguments`, async () => {
      try {
        UserController.hasUserByUsername(undefined);
        UserController.hasUserByUUID(undefined);
        UserController.createUser(undefined, undefined, undefined, undefined);
        UserController.getUserFromUUID(undefined);
      } catch (error) {
        expect(error).to.be.a("Error");
        expect(error.message).to.be.equal(/Invalid/);
      }
    });
  });
});
