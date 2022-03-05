/**
 * This is a template for the configuration.
 */
interface ConfigurationSchema {
    Database: {
        Host: string;
        Port: string;
        Username: string;
        Password: string;
        Database: string;
        EnableLogging: boolean;
    };
}

const Configuration = {
    /**
     * This is for a production environment
     * @type {ConfigurationSchema}
     */
    production: {
        Database: {
            Host: process.env.MYSQL_HOST || "localhost",
            Port: process.env.MYSQL_PORT || "3306",
            Username: process.env.MYSQL_USERNAME || "root",
            Password: process.env.MYSQL_PASSWORD || "",
            Database: process.env.MYSQL_DATABASE || "comic_paper",
            EnableLogging: process.env.MYSQL_ENABLE_LOGGING === "true",
        },
    },
    /**
     * For development environment
     */
    development: {
        Database: {
            Host: process.env.MYSQL_DEV_HOST || "localhost",
            Port: process.env.MYSQL_DEV_PORT || "3306",
            Username: process.env.MYSQL_DEV_USERNAME || "root",
            Password: process.env.MYSQL_DEV_PASSWORD || "",
            Database: process.env.MYSQL_DEV_DATABASE || "",
            EnableLogging: process.env.MYSQL_DEV_ENABLE_LOGGING === "true" || true,
        },
    },
    /**
     * For testing environment
     */
    test: {
        Database: {
            Host: process.env.MYSQL_TEST_HOST || "localhost",
            Port: process.env.MYSQL_TEST_PORT || "3306",
            Username: process.env.MYSQL_TEST_USERNAME || "root",
            Password: process.env.MYSQL_TEST_PASSWORD || "",
            Database: process.env.MYSQL_TEST_DATABASE || "comics_paper_test",
            EnableLogging: process.env.MYSQL_TEST_ENABLE_LOGGING === "true" || false,
        },
    },
};

export default Configuration;

/**
 * Check whether the configuration of environment is valid.
 * @param environmentName a environment name to check.
 */
function hasConfigurationEnvironment(environmentName: string) {
    // Not available
    if (Configuration[environmentName.trim()] === undefined) {
        throw new Error("Configuration environment is not available.");
    }
}

/**
 * Get the ConfigurationSchema of current environment (process.env.NODE_ENV).
 * @returns a ConfigurationSchema object.
 */
export function getCurrentConfiguration(): ConfigurationSchema {
    const environmentName = process.env.NODE_ENV;
    console.log("====================");
    console.log(process.env.NODE_ENV);
    console.log("====================");
    hasConfigurationEnvironment(environmentName);
    return Configuration[environmentName];
}
