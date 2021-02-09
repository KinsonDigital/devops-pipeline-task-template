import { Environment } from "./Environment";
import { PipelineLogger } from "./PipelineLogger";
import { TaskInputs } from "./TaskInputs";
import { EnvironmentError } from "./Errors/EnvironmentError";
import { TaskInputError } from "./Errors/TaskInputError";

/**
 * A build and release task for running postman tests for one or more Azure DevOps cards.
 */
export class BuildReleaseTask {
    private taskInputs: TaskInputs;
    private pipelineLogger: PipelineLogger;
    private hasInitialized: boolean = false;

    /**
     * Initialize a new instance of BuildReleaseTask.
     */
    constructor() {
        this.pipelineLogger = new PipelineLogger();
        this.taskInputs = new TaskInputs();
    }

    /**
     * Initializes the build and release task.
     * @summary This function must be invoked before the run() function.
     * @returns {Promise<void>} A promise to await or then/catch against.
     */
    public async initAsync(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            Environment.loadEnvironmentAsync().then(() => {
                    this.taskInputs?.initAsync().then(async () => {
                            this.logInitInfo();

                            // TODO: Add task processing code here

                            this.hasInitialized = true;
                            resolve();
                    }).catch((error) => {
                        reject(error);
                    });
                }).catch((error: EnvironmentError) => {
                    reject(error);
                });
        });
    }

    /**
     * Runs the custom build and release task.
     * @returns {Promise<void>} A promise to await or then/catch against.
     */
    public async runAsync(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            if (!this.hasInitialized) {
                reject(new Error("The task has not been initialized.  You must invoke 'BuildReleaseTask.init() first.'"));
                return;
            }
    
            // TODO: Add task processing code here
            this.pipelineLogger.logDebug(`The value of input 'SampleInput' is ${this.taskInputs.sampleInput}`);

            resolve();
        });
    }

    /**
     * Returns a value indicating whether the given parameter is an Error object type.
     * @param {any} value The value to check.
     * @returns {boolean} True if the given object is an error object.
     */
    public isError(value: any): value is Error {
        return value instanceof(Error);
    }

    /**
     * Logs initialization related info to the console.
     */
    private logInitInfo(): void {
        this.pipelineLogger.emptyLine();
        this.pipelineLogger.logSection("<|------------------------TASK INITIALIZATION STARTED-------------------------|>");
        this.pipelineLogger.emptyLine();

        if (Environment.isDebug) {
            this.pipelineLogger.emptyLine();
            this.pipelineLogger.logWarning("!!!!------------------------WARNING------------------------!!!!");
            this.pipelineLogger.logWarning("Task running in debug mode. Rebuild the task in PRODUCTION mode.");
            this.pipelineLogger.emptyLine();
        }

        this.pipelineLogger.logDebug("All Inputs Validated");
        this.pipelineLogger.emptyLine();

        // TODO: Log additional initialization messages here

        this.pipelineLogger.emptyLine();
    }
}
