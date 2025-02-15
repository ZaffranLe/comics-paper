# Setup the Database

## Prerequisites

1. Ensure Docker is installed and running.
2. Make sure you have cloned the repository and set up the environment.

## Steps to Start the Database

1. Run the following command to start MySQL:
   ```sh
   docker compose up -d mysql
   ```
2. The database credentials are stored in the `.env` file, which is generated from the template.
3. If you need to view the generated password, use the `--log-password` flag when running the setup script:
   ```sh
   bun run ./scripts/generate-database-credentials.ts
   ```

## Notes

- Ensure that `.env` is properly configured before running the database.
- The password is generated securely and stored in `.env`, but it is recommended to manage secrets properly in production environments.
