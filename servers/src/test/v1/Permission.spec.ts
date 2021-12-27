import { PermissionGroupController } from "./../../v1/controllers/PermissionGroupController";
import * as chai from "chai";
import { PermissionGroupEnum } from "../../v1/interfaces/PermissionGroupInterface";
const expect = chai.expect;

describe("v1: Permission Group", () => {
  describe(`controller`, async () => {
    it("should be defined", async () => {
      expect(PermissionGroupController).to.be.not.undefined;
    });
    it(`should able to create permission group`, async () => {
      const permissionGroup = await PermissionGroupController.createPermissionGroup(
        9999, "test", "description test"
      );
      // expect(permissionGroup).to.be.not.undefined;
      // expect(permissionGroup.name).to.be.equal(PermissionGroupEnum.ADMIN);
    });
  });

  describe(`implementation`, async () => {
    it(`should contains ADMIN permission group`, async () => {
      expect(
        await PermissionGroupController.hasPermissionGroup(
          PermissionGroupEnum.ADMIN
        )
      ).to.be.true;
    });

    it(`should contains USER permission group`, async () => {
      expect(
        await PermissionGroupController.hasPermissionGroup(
          PermissionGroupEnum.USER
        )
      ).to.be.true;
    });

    it(`should contains MOD permission group`, async () => {
      expect(
        await PermissionGroupController.hasPermissionGroup(
          PermissionGroupEnum.MOD
        )
      ).to.be.true;
    });
  });
});
