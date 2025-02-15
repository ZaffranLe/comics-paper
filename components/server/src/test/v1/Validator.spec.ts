import * as chai from "chai";
import { isValidNickname } from "../../v1/utils/ValidatorUtils";
const expect = chai.expect;

describe(`v1: validator`, () => {
  describe(`nickname`, () => {
    // nick name value is a string with maximum length is 20 and can contain only letters, numbers, dot character (.),
    // and the underscore character (_) and
    // generate nickname asset
    const nicknameDummies = [
      "password",
      "assertion",
      "salty_12",
      "salty_1234",
      "salty_12345",
      "salty_123456",
      "jimmy_123",
      "jime.123",
    ];
    const wrongNicknameDummies = [
      "",
      "__-1dasd",
      "-)()@oaisd",
      "{this is a code}",
      "injectthing()=++__",
      "c++ is me",
    ];
    it(`should true when provide valid nickname`, (done) => {
      Promise.all(nicknameDummies.map((item) => isValidNickname(item))).then(
        (responseBooleanList: boolean[]) => {
          // for each equal true all string
          expect(responseBooleanList.every((item) => item === true)).to.be.true;
          done();
        }
      );
    });

    it(`should false when provide invalid nickname`, (done) => {
      Promise.all(
        wrongNicknameDummies.map((item) => isValidNickname(item))
      ).then((responseBooleanList: boolean[]) => {
        // for each equal true all string
        expect(responseBooleanList.every((item) => item === false)).to.be.true;
        done();
      });
    });
  });
});
