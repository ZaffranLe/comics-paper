import { isDevelopmentMode, isTestMode } from "./Environment";
import { ComicChapterViewTypeEnum } from "./interfaces/ComicChapterInterface";
import { PermissionGroupEnum } from "./interfaces/PermissionGroupInterface";
import DatabaseBuilder, { createTable } from "./utils/DatabaseBuilder";

/**
 * Table constants to map table naming.
 */
export const Tables = {
    // User
    User: "users",
    // Permission groups
    PermissionGroup: "permission_groups",
    // Permissions
    Permission: "permissions",
    // Permission in groups
    PermissionRelationship: "permission_relationships",
    // Users permissions
    UserPermission: "user_permissions",
    // Resources
    Resource: "resources",
    // Comic
    Comic: "comics",
    // Comic chapters
    ComicChapter: "comic_chapters",
    // Comic chapter blocks
    ComicChapterBlock: "comic_chapter_blocks",
    // Comic tag
    ComicTag: "comic_tags",
    // Comic book tag
    ComicBookTag: "comic_book_tags",
    // Comic comment
    ComicComment: "comic_comments",
    // Review
    ComicReview: "comic_reviews",
};

export async function setupDatabase() {
    console.log("Setting up database");

    // Permission group
    await createTable(Tables.PermissionGroup, (table) => {
        table.increments("id").primary();
        table.string("name").notNullable().unique();
        table.text("description").notNullable();
    });

    // Permissions
    await createTable(Tables.Permission, (table) => {
        table.increments(`id`).primary();
        table.string(`name`).notNullable();
        table.text(`description`).notNullable();
        // table.integer(`permissionGroup`).notNullable();
    });

    await createTable(Tables.PermissionRelationship, (table) => {
        table.integer(`permissionGroup`);
        table.integer(`permissionId`);
        table.primary([`permissionGroup`, `permissionId`]);
    });

    // Users
    await createTable(Tables.User, (table) => {
        table.increments("id").primary();
        table.string(`username`).unique().notNullable();
        table.string(`password`).notNullable();
        table.string(`email`).unique().nullable();
        table.string(`nickname`).nullable();
        table.string(`introduction`).nullable();
    });

    // User permissions
    await createTable(Tables.UserPermission, (table) => {
        table.integer(`userId`).primary();
        table.integer(`permissionGroup`).notNullable().defaultTo(PermissionGroupEnum.USER);
    });

    await createTable(Tables.Resource, (table) => {
        table.increments("id").primary();
        table.string("originalName").notNullable();
        table.string("fileName").notNullable();
        table.string(`path`).notNullable();
        table.integer(`size`).notNullable();
        table.integer(`uploader`).notNullable();
        table.dateTime(`uploadedAt`).notNullable().defaultTo(DatabaseBuilder.fn.now());
    });

    await createTable(Tables.Comic, (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.text(`description`).notNullable();
        table.integer(`postedBy`).notNullable();
        table.string(`author`).notNullable();
        table.string(`category`).notNullable();
        table.dateTime(`createdAt`).notNullable().defaultTo(DatabaseBuilder.fn.now());
        table.dateTime(`updatedAt`).notNullable().defaultTo(DatabaseBuilder.fn.now());
        table.string(`thumbnail`).nullable();
        table.integer(`views`).notNullable().defaultTo(0);
        table.integer(`likes`).notNullable().defaultTo(0);
        table.string(`slug`).notNullable();
    });

    await createTable(Tables.ComicChapter, (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("chapter").notNullable();
        table.integer(`comicId`).notNullable();
        table.integer(`postedBy`).notNullable();
        table.dateTime(`createdAt`).notNullable().defaultTo(DatabaseBuilder.fn.now());
        table.dateTime(`updatedAt`).notNullable().defaultTo(DatabaseBuilder.fn.now());
        table
            .integer("viewType")
            .notNullable()
            .defaultTo(ComicChapterViewTypeEnum.COMIC_CHAPTER_VIEW_TYPE_IMAGE);
        table.integer("length").notNullable().defaultTo(0);
    });

    await createTable(Tables.ComicChapterBlock, (table) => {
        table.increments("id").primary();
        table.integer("chapterId").notNullable();
        table.integer("index").notNullable();
        table.text("content").notNullable();
    });

    await createTable(Tables.ComicTag, (table) => {
        // id, keywords
        table.increments("id").primary();
        table.string("keyword").notNullable();
    });

    await createTable(Tables.ComicBookTag, (table) => {
        //comicId and tagId
        table.integer("comicId");
        table.integer("tagId");
        table.primary([`comicId`, `tagId`]);
    });

    // comment
    await createTable(Tables.ComicComment, (table) => {
        table.increments("id").primary();
        table.integer("comicChapterId").notNullable();
        table.integer("authorId").notNullable();
        table.text("content").notNullable();
        table.dateTime(`createdAt`).notNullable().defaultTo(DatabaseBuilder.fn.now());
    });

    // Comic review
    await createTable(Tables.ComicReview, (table) => {
        table.increments("id").primary();
        table.integer("comicId").notNullable();
        table.integer("userId").notNullable();
        table.text("content").notNullable();
        table.integer("rating").notNullable();
        table.dateTime(`createdAt`).notNullable().defaultTo(DatabaseBuilder.fn.now());
    });
}

export async function cleanUpDatabase() {
    if (!isDevelopmentMode() && !isTestMode()) {
        throw new Error("Unexpected environment (must be development or test)");
    }

    // console.warn(chalk.red(`Invoking clean up database (utility for test)...`));
    // Truncate
    for (let table in Tables) {
        if (Tables.hasOwnProperty(table)) {
            console.log(`Truncating table ${table}...`);
            await DatabaseBuilder(Tables[table]).truncate();
        }
    }

    for (let table in Tables) {
        if (Tables.hasOwnProperty(table)) {
            console.log(`Dropping table ${table}...`);
            await DatabaseBuilder.schema.dropTable(Tables[table]);
        }
    }
}
