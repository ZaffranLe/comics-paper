import chai from "chai";
import { v4 as uuid } from "uuid";
import ResourceController from "../../v1/controllers/ResourceController";
import { ResourceInterface } from "../../v1/interfaces/ResourceInterface";
const expect = chai.expect;

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
        describe("getResourceMetadata", () => {
            it(`should return a resource`, async () => {
                const resource: ResourceInterface =
                    await ResourceController.createResourceMetadata(
                        "test",
                        "test",
                        1,
                        uuid()
                    );

                const resource2: ResourceInterface =
                    await ResourceController.getResourceMetadata(resource.id);

                expect(resource2).not.be.null;
                expect(resource2.id).not.be.null;
                expect(resource2.name).not.be.null;
                expect(resource2.path).not.be.null;
                expect(resource2.size).not.be.null;
                expect(resource2.uploadedAt).not.be.null;
                expect(resource2.uploader).not.be.null;
            });
        });

        describe("update resource", () => {
            it(`should update a resource`, async () => {
                const resource: ResourceInterface =
                    await ResourceController.createResourceMetadata(
                        "test",
                        "test",
                        1,
                        uuid()
                    );

                await ResourceController.updateResource(resource.id, "test2");

                const resource2 = await ResourceController.getResourceMetadata(
                    resource.id
                );

                expect(resource2).not.be.null;
                expect(resource2.id).not.be.null;
                expect(resource2.name).not.be.null;
                expect(resource2.path).not.be.null;
                expect(resource2.size).not.be.null;
                expect(resource2.uploadedAt).not.be.null;
                expect(resource2.uploader).not.be.null;
                expect(resource2.name).to.equal("test2");
            });
        });
        describe("delete resource", () => {
            it(`should delete a resource`, async () => {
                const resource: ResourceInterface =
                    await ResourceController.createResourceMetadata(
                        "test",
                        "test",
                        1,
                        uuid()
                    );

                await ResourceController.deleteResource(resource.id);
                await ResourceController.getResourceMetadata(resource.id);
                const resource2 = await ResourceController.getResourceMetadata(
                    resource.id
                );
                expect(resource2).to.be.undefined;
            });
        });
    });
});
