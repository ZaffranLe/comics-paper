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
      Host: "localhost",
      Username: "root",
      Password: "",
      Database: "",
      EnableLogging: true,
    },
  },
  /**
   * For development environment
   */
  development: {
    Database: {
      Host: "localhost",
      Username: "root",
      Password: "123",
      Database: "comics_paper",
      EnableLogging: true,
    },
  },
  /**
   * For testing environment
   */
  test: {
    Database: {
      Host: "localhost",
      Username: "root",
      Password: "123",
      Database: "comics_paper_test",
      EnableLogging: false,
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
  if (Configuration[environmentName] === undefined) {
    throw new Error("Configuration environment is not available.");
  }
}

/**
 * Get the ConfigurationSchema of current environment (process.env.NODE_ENV).
 * @returns a ConfigurationSchema object.
 */
export function getCurrentConfiguration(): ConfigurationSchema {
  const environmentName = process.env.NODE_ENV;
  hasConfigurationEnvironment(environmentName);
  return Configuration[environmentName];
}
