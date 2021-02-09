import { config, DotenvConfigOptions } from "dotenv";
import fs from "fs";
import { EnvironmentError } from "./Errors/EnvironmentError";

/**
 * Loads and holds the state of the environment.
 */
export abstract class Environment {
    private static environmentLoaded: boolean = false;

    /**
     * Returns a valid indicating whether the environment is in debug mode.
     * @returns {boolean} True if the task is running in debug mode.
     * @summary NOTE: The task should always run in production mode when running in the pipeline.
     * @throws {EnvironmentError} Thrown when the environment has not been loaded.
     */
    public static get isDebug(): boolean {
        if (Environment.environmentLoaded) {
            return process.env.NODE_ENV === undefined || process.env.NODE_ENV.toUpperCase() === "DEBUG";
        } else {
            throw new EnvironmentError("Environment Not Loaded");
        }
    }
    
    /**
     * Returns a valid indicating whether the environment is in production mode.
     * @returns {boolean} True if the task is running in production mode.
     * @summary NOTE: The task should always run in production mode when running in the pipeline.
     * @throws {EnvironmentError} Thrown when the environment has not been loaded.
     */
    public static get isProduction(): boolean {
        if (Environment.environmentLoaded) {
            return process.env.NODE_ENV !== undefined && process.env.NODE_ENV.toUpperCase() === "PRODUCTION";
        } else {
            throw new EnvironmentError("Environment Not Loaded");
        }
    }

    /**
     * Loads the environment.
     * @returns {Promise<void>} The promise to await against.
     */
    public static async loadEnvironmentAsync(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                if (Environment.environmentLoaded) {
                    resolve();
                } else {
                    await this.getEnvironmentConfig().then((configOptions: DotenvConfigOptions) => {
                        config(configOptions);
                        Environment.environmentLoaded = true;
                        resolve();
                    }).catch((error: EnvironmentError) => {
                        reject(error);
                    });
                }
            } catch (error) {
                reject(new EnvironmentError(error.message));
            }
        });
    }

    /**
     * Gets the environment configuration by loading the environment variables
     * from a '.env' file.
     * @returns {Promise<DotenvConfigOptions>} The environment config options.
     */
    private static getEnvironmentConfig(): Promise<DotenvConfigOptions> {
        return new Promise<DotenvConfigOptions>((resolve, reject) => {
            const options: DotenvConfigOptions = {
                path: "",
            };
            const envPath: string = `${__dirname}\\.env`;

            fs.stat(envPath, (error, stats) => {
                if (error !== null && error.code === 'ENOENT' && error.errno === -4058) {
                    reject(new EnvironmentError(`The environment variables file '${envPath}' does not exist.\n\tExpecting file name '.env'.`));
                } else {
                    options.path = envPath;
                    resolve(options);
                }
            });
        });
    }
}