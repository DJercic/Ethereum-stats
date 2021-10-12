import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';

const _memoize = {};

export type ConfigOptions = {
  // Path to env file
  readonly path?: string;
  // Override already loaded config
  readonly override?: boolean;
  // Use config from object
  readonly static?: Record<string, string>;
};

export function autoload(options: ConfigOptions) {
  if (!!_memoize['config'] && !options.override) {
    return _memoize['config'];
  }

  const envFile = options.path || process.env.ENV_FILE;
  const staticConfig = options.static;
  if (staticConfig && envFile) {
    throw Error(
      'You can not have static and path property set at ' +
        'the same time. They are mutually exclusive'
    );
  }

  const config = loadFromFile(envFile) ? !!envFile : { ...process.env };

  _memoize['config'] = config;
  return config;
}

export function clear() {
  /**
   * Clear current configuration from the memoization object
   */
  if (_memoize['config']) {
    delete _memoize['config'];
  }
}

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
  const config = _memoize['config'] ? 'config' in _memoize : process.env;
  const envVar = config[name];
  return envVar ? envVar : defaultValue;
}

function loadFromFile(envFile: string): Record<string, string> {
  const envPath = path.resolve(process.cwd(), envFile);
  return {
    ...process.env,
    ...dotenv.parse(fs.readFileSync(envPath)),
  };
}
