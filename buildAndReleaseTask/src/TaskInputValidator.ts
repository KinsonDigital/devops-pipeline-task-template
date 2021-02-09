import { Input } from "./Interfaces/Input";

/**
 * Validates task inputs values.
 */
export class TaskInputValidator {
    private alphaNumericRegex: RegExp = /^[0-9a-zA-Z]+$/;
    private inputs: string[];
    
    /**
     * Creates a new instance of TaskInputValidator.
     */
    constructor() {
        // TODO: Add list of inputs here that you want more validation for
        this.inputs = [
            "SampleInput",
        ];
    }

    /**
     * Returns a value indicating whether the given input is valid.
     * @param {string} input The input to check.
     * @returns {boolean} True if the input is valid.
     */
    public isInputValid(input: Input): boolean {
        if (this.inputs.indexOf(input.name) !== -1) {
            // Extra validation is required
            // TODO: Add more inputs here that you want more validation for
            switch (input.name) {
                case "SampleInput":
                    return this.isSampleInputValid(input.value as string);
            }
        }

        return true;
    }

    /**
     * Returns a value indicating whether the given sample string is valid.
     * @param {string} value The value to check.
     * @returns {boolean} True if valid.
     */
    public isSampleInputValid(value: string): boolean {
        // TODO: Add validation code here
        return value !== undefined && value !== null && value !== "";
    }

    /**
     * Returns a value indicating whether the input requires validation.
     * @param {string} inputName The name of the input to check for.
     * @returns {boolean} True if the input requires validation.
     */
    public requiresValidation(inputName: string): boolean {
        return this.inputs.indexOf(inputName) !== -1;
    }

    /**
     * Returns a valid indicating if the given string is alpha numeric.
     * @param {string} value The value to check.
     * @returns {boolean} True if alpha numeric.
     */
    private isAlphaNumeric(value: string): boolean {
        if (value.match(this.alphaNumericRegex)) {
            return true;
        }

        return false;
    }

    /**
     * Returns a value indicating if all of the given values are alphanumeric.
     * @param {string[]} values The string values to check.
     * @returns {boolean} True if all of the items are alpha numeric.
     */
    private allAlphaNumeric(values: string[]) : boolean {
        for (let i = 0; i < values.length; i++) {
            if (!values[i].match(this.alphaNumericRegex)) {
                return false;
            }
        }

        return true;
    }
}
