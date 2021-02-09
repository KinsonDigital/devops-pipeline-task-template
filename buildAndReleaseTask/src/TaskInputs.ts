import { getBoolInput, getInput } from "azure-pipelines-task-lib";
import fs from "fs";
import { glob } from "glob";
import { Environment } from "./Environment";
import { EnvironmentError } from "./Errors/EnvironmentError";
import { TaskInputError } from "./Errors/TaskInputError";
import { Input } from "./Interfaces/Input";
import { TaskInputValidator } from "./TaskInputValidator";

/**
 * Manages the custom pipeline task inputs.
 */
export class TaskInputs {
    private inputValidator: TaskInputValidator;
    private inputs: Input[] = new Array<Input>(0);
    private hasInitialized: boolean = false;    

    /**
     * Creates a new instance of TaskInputs
     */
    constructor() {
        this.inputValidator = new TaskInputValidator();
    }

    /**
     * Gets the name of the Azure DevOps organization.
     * @returns {string} An organization name.
     */
    public get sampleInput(): string {
        if (!this.hasInitialized) {
            throw new TaskInputError("The 'TaskInput' has not been initialized.");
        }

        return this.inputs.filter((value: Input) => value.name === "SampleInput")[0].value as string;
    }

    /**
     * Initializes the task input.
     * @returns {Promise<void>} Nothing is returned.
     */
    public async initAsync(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.hasInitialized) {
                resolve();
                return;
            }

            try {
                Environment.loadEnvironmentAsync().then(async () => {
                    this.loadInputsAsync().then((inputs: Input[]) => {
                        this.inputs = inputs;

                        this.inputs.forEach((input: Input) => {
                            try {
                                switch (input.type) {
                                    case "string":
                                        input.value = this.getStringInput(input.name);
                                        break;
                                    case "boolean":
                                        input.value = this.getBoolInput(input.name);
                                        break;
                                    default:
                                        reject(new TaskInputError(`Unknown input type '${input.type}'`));
                                }
                            } catch (error) {
                                reject(error);
                            }
            
                            if (!this.inputValidator.isInputValid(input)) {
                                reject(new TaskInputError(`The value '${input.value}' syntax for input '${input.name}' is invalid.`));
                            }
                        });
            
                        resolve();
            
                        this.hasInitialized = true;
                    }).catch((error: Error | TaskInputError) => {
                        reject(error);
                    });
                }).catch((error: EnvironmentError) => {
                    reject(error);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
    
    /**
     * Loads the inputs from disk inside of the task package itself.
     * This is the 'task.json' file.
     * @returns {Promise<Input[]>} The input data of the task.
     */
    private async loadInputsAsync(): Promise<Input[]> {
        return new Promise<Input[]>(async (resolve, reject) => {
            try {
                const basePath: string = this.removeLastDir(__dirname);
                
                glob(`${basePath}/**/task.json`, (error: Error | null, matches: string[]) => {
                    if (error !== null || matches.length <= 0) {
                        console.log(new TaskInputError(`The 'task.json' file could not be found anywhere in the folder or child folders '${__dirname}'`));
                        return;
                    }
                    
                    matches.forEach(path => {
                        try {
                            let jsonData: Buffer = fs.readFileSync(path);
                            resolve(JSON.parse(jsonData.toString()).inputs);
                        } catch (error) {
                            reject(new TaskInputError(error.message));
                        }
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Gets the task input as a string.
     * @param {string} inputName The name of the task input.
     * @returns {string} The input string value.
     */
    private getStringInput(inputName: string): string {
        if (Environment.isProduction) {
            const inputString: string | undefined = getInput(inputName, true);

            if (inputString === undefined) {
                return `The input ${inputName} is undefined.`;
            }

            return inputString.trim();
        } else if (Environment.isDebug) {
            // Get value from local environment variables for testing
            const inputString: string | undefined = process.env[inputName];

            if (inputString === undefined) {
                return `The input ${inputName} is undefined.`;
            }

            return inputString.trim();
        } else {
            throw `NODE_ENV value of ${process.env.NODE_ENV} unknown.`
        }
    }

    /**
     * Gets the task input as a boolean.
     * @param {string} inputName The name of the input.
     * @returns {boolean} The input boolean value.
     */
    private getBoolInput(inputName: string): boolean {
        if (Environment.isProduction) {
            try {
                const inputBool: boolean = getBoolInput(inputName, true);
                
                return inputBool;
            } catch (error) {
                throw new TaskInputError(`The input ${inputName} is undefined.`);
            }
        } else if (Environment.isDebug) {
            // Get value from local environment variables for testing
            const inputValue: string | undefined = process.env[inputName];

            if (inputValue?.toUpperCase() === "TRUE") {
                return true;
            } else if (inputValue?.toUpperCase() === "FALSE") {
                return false;
            }  else {
                throw new TaskInputError(`The input ${inputName} is undefined. Add variable to '.env' file.`);
            }
        } else {
            throw new EnvironmentError(`NODE_ENV value of ${process.env.NODE_ENV} unknown.`);
        }
    }

    /**
     * Replaces all '\' characters with '/' characters.
     * @param {string} value The value to process.
     * @returns {string} The given value with the backslashes replaced.
     */
    private replaceBackSlashes(value: string): string {
        let iteration: number = 0;

        while (value.indexOf("\\") !== -1) {
            iteration += 1;
            value = value.replace("\\", "/");

            if (iteration > 100) {
                break;
            }
        }

        return value;
    }

    /**
     * Removes the last directory in a directory path.
     * @param {string} path The path to remove the directory from.
     * @returns {string} The given path with the last directory removed.
     */
    private removeLastDir(path: string): string {
        path = this.replaceBackSlashes(path);
    
        let sections: string[] = path.split("/");
    
        let result: string = "";
    
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            
            if (i < sections.length - 1) {
                result += `${section}/`;
            }
        }
    
        return result;
    }
}
