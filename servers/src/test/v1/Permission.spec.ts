import { Tables } from "./../../v1/Database";
import { PermissionGroupController } from "./../../v1/controllers/PermissionGroupController";
import * as chai from "chai";
import { PermissionGroupEnum } from "../../v1/interfaces/PermissionGroupInterface";
import DatabaseBuilder from "../../v1/utils/DatabaseBuilder";
import { PermissionController } from "../../v1/controllers/PermissionController";

const expect = chai.expect;

/**
 * Permission groups
 */
describe("v1: Permission Group", () => {
  describe(`Controller`, async () => {
    /**
     * Asset
     */
    const permissionGroup = {
      id: 999,
      name: "idkWhatIsiz",
      description: "Do Anything Here please",
    };

    /**
     * Clean up
     */
    afterEach(async () => {
      await DatabaseBuilder(Tables.PermissionGroup)
        .where({ id: permissionGroup.id })
        .delete();
    });

    /**
     * Well defined
     */
    it("should be defined", async () => {
      expect(PermissionGroupController).to.be.not.undefined;
    });

    /**
     * createPermissionGroup functionality check
     */
    it(`should working with method createPermissionGroup`, async () => {
      await PermissionGroupController.createPermissionGroup(
        permissionGroup.id,
        permissionGroup.name,
        permissionGroup.description
      );
      const response = await DatabaseBuilder(Tables.PermissionGroup)
        .select()
        .from(Tables.PermissionGroup)
        .where({ id: permissionGroup.id })
        .first();

      expect(response).to.be.not.undefined;
      expect(response.id).to.be.equal(permissionGroup.id);
      expect(response.name).to.be.equal(permissionGroup.name);
      expect(response.description).to.be.equal(permissionGroup.description);
    });

    /**
     * hasPermissionGroup
     */
    it(`should working with method hasPermissionGroup`, async () => {
      await PermissionGroupController.createPermissionGroup(
        permissionGroup.id,
        permissionGroup.name,
        permissionGroup.description
      );
      const response = await PermissionGroupController.hasPermissionGroup(
        permissionGroup.id
      );
      expect(response).to.be.true;
    });

    it(`has permission group by name`, async () => {
      await PermissionGroupController.createPermissionGroup(
        permissionGroup.id,
        permissionGroup.name,
        permissionGroup.description
      );
      const response = await PermissionGroupController.hasPermissionGroupByName(
        permissionGroup.name
      );
      expect(response).to.be.true;
    });

    /**
     * Get alls permission groups
     */
    it(`should working with method getAllPermissionGroups`, async () => {
      await PermissionGroupController.createPermissionGroup(
        permissionGroup.id,
        permissionGroup.name,
        permissionGroup.description
      );
      const response = await PermissionGroupController.getAllPermissionGroups();
      expect(response).to.be.not.undefined;
      expect(response).to.be.an("array");
    });
  });

  /**
   * Initialization
   */
  describe(`Implementation`, async () => {
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

/**
 * Permissions
 */
describe(`v1: Permission`, () => {
  describe(`Controller`, () => {
    const permissionAsset = {
      id: 999,
      name: "customPermission",
      description: "custom permission description",
    };

    /**
     * Create a custom permission to test.
     */
    beforeEach(async () => {
      await PermissionController.createPermission(
        permissionAsset.id,
        permissionAsset.name,
        permissionAsset.description
      );
    });

    /**
     * Clean up afterwards
     */
    afterEach(async () => {
      // remove permission
      await DatabaseBuilder(Tables.Permission)
        .where({ id: permissionAsset.id })
        .delete();
    });

    /**
     * Controller method create permission
     */
    it(`should create a permission`, async () => {
      const response = await DatabaseBuilder(Tables.Permission)
        .select()
        .where({ id: permissionAsset.id })
        .first();

      expect(response).to.be.not.undefined;
      expect(response.id).to.be.equal(permissionAsset.id);
      expect(response.name).to.be.equal(permissionAsset.name);
      expect(response.description).to.be.equal(permissionAsset.description);
    });

    /**
     * has permission functionality
     */
    it(`should has the permission`, async () => {
      expect(await PermissionController.hasPermission(permissionAsset.id)).to.be
        .true;
    });

    /**
     * Get all functionality
     */
    it(`should get all permissions`, async () => {
      const response = await PermissionController.getPermissions();

      expect(response).to.be.not.undefined;
      expect(response).to.be.an("array");
    });
  });

  /**
   * Initialization afterwards.
   */

  describe(`Implementation`, () => {
    // check all permission enums as each case
  });
});
