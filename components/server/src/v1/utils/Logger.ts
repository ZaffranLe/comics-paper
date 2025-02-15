import chalk from "chalk";

export const Logger = {
  info: (message: string) => {
    console.log(chalk.gray(`[INFO] ${message}`));
  },
  warn: (message) => {
    console.warn(chalk.yellow(`[WARN] ${message}`));
  },
  error: (message) => {
    console.error(chalk.red(`[ERROR] ${message}`));
  },
};
