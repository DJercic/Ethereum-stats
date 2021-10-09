export function need(name: string): string {
  /**
   * Mark env variable required if requested using this function.
   */

  const envVar = process.env[name];
  if (!envVar) {
    throw Error(`Env variable {name} is required!`);
  }
  return envVar;
}
