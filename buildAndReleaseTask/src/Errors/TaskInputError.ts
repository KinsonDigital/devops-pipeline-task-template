/**
 * Occurs when an error has occurred with the the task inputs.
 */
export class TaskInputError implements Error {
    /**
     * The name of the error.
     */
    name: string = "TaskInputError";

    /**
     * The error message.
     */
    message: string;

    /**
     * The call stack of where the error occurred.
     */
    stack?: string | undefined;

    /**
     * Creates a new instance of an TaskInputError.
     * @param {string} message The error message.
     */
    constructor(message: string) {
        this.message = message;
    }
}