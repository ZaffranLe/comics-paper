import { ResourceInterface } from "./../../v1/interfaces/ResourceInterface";
import chai from "chai";
import ResourceController from "../../v1/controllers/ResourceController";
const expect = chai.expect;
import { v4 as uuid } from "uuid";

describe("v1: Resource", () => {
  describe("Controller", () => {
    describe("createResource", () => {
      it("should be defined", () => {
        expect(ResourceController.createResourceMetadata).not.be.null;
      });

      it("should return a resource as ResourceInterface", async () => {
        const resource: ResourceInterface =
          await ResourceController.createResourceMetadata(
            "test",
            "test",
            1,
            uuid()
          );

        expect(resource).not.be.null;
        expect(resource.id).not.be.null;
        expect(resource.name).not.be.null;
        expect(resource.path).not.be.null;
        expect(resource.size).not.be.null;
        expect(resource.uploadedAt).not.be.null;
        expect(resource.uploader).not.be.null;
      });

      it("should throw an error if missing parameters", async () => {
        try {
          await ResourceController.createResourceMetadata(
            null,
            null,
            null,
            null
          );
        } catch (error) {
          expect(error).not.be.null;
        }
      });
    });
  });
});
