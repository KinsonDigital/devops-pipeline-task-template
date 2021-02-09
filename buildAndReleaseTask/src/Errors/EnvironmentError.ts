/**
 * Occurs when an error has occurred with the environment setup.
 */
export class EnvironmentError implements Error {
    /**
     * The name of the error.
     */
    name: string = "EnvironmentError";

    /**
     * The error message.
     */
    message: string;

    /**
     * The call stack of where the error occurred.
     */
    stack?: string | undefined;

    /**
     * Creates a new instance of an EnvironmentError.
     * @param {string} message The error message.
     */
    constructor(message: string) {
        this.message = message;
    }
}