import dotenv from 'dotenv';

dotenv.config({ path: process.env.ENV_FILE });

export function need(name: string): string {
  /**
   * Mark env variable required if requested using this function.
   */
  const envVar = read(name);
  if (!envVar) {
    throw Error(`Env variable ${name} is required!`);
  }
  return envVar;
}

export function read(
  name: string,
  defaultValue: string = undefined
): string | undefined {
  /**
   * Read env variable. If variable is not set return default value.
   *
   */
  const envVar = process.env[name];
  return envVar ? envVar : defaultValue;
}
