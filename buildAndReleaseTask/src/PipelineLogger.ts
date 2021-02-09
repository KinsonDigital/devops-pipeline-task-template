import chalk, { Chalk } from "chalk";
import { Environment } from "./Environment";
import { LogType } from "./LogType";

/**
 * Logs messages of different types to the Azure DevOps pipeline console.
 */
export class PipelineLogger {
    /**
     * Logs an error message in the format of Azure DevOps logs system.
     * @param {string} message The message to log.
     */
    public logError(message: string): void {
        this.log(message, LogType.Error);
    }

    /**
     * Logs a warning to the console.
     * @param {string} message The message to log.
     */
    public logWarning(message: string): void {
        this.log(message, LogType.Warning);
    }

    /**
     * Logs a section to the console.  Used for
     * grouping log messages together.
     * @param {string} message The message to log.
     */
    public logSection(message: string): void {
        this.log(message, LogType.Section);
    }

    /**
     * Logs a debug message to the console.
     * @param {string} message The message to log.
     */
    public logDebug(message: string): void {
        this.log(message, LogType.Debug);
    }

    /**
     * Logs a separator line to the console.
     */
    public separator(): void {
        this.emptyLine();
        this.log("----------------------------------------------------------------------------", LogType.None);
        this.emptyLine();
    }

    /**
     * Logs an empty line.
     */
    public emptyLine(): void {
        console.log();
    }

    /**
     * Logs content of the given type to the Azure DevOps
     * or local CLI/Terminal.
     * @param {string} The content to log.
     * @param {LogType} logType The type of log to create.
     */
    private log(content: string, logType: LogType) : void {
        let logPrefix: string = "";
        let color: Chalk = chalk.rgb(255, 255, 255);

        switch (logType) {
            case LogType.Debug:
                logPrefix = "##[debug]";
                color = chalk.rgb(153, 102, 255);
                break;
            case LogType.Section:
                logPrefix = "##[section]";
                break;
            case LogType.Error:
                logPrefix = "##[error]";
                color = chalk.rgb(226, 58, 58);
                break;
            case LogType.Warning:
                logPrefix = "##[warning]";
                color = chalk.rgb(235, 148, 45);
                break;
            case LogType.None:
                break;
            default:
                color = chalk.rgb(255, 255, 255); // White
                break;
        }

        if (Environment.isDebug) {
            console.log(color.visible(`${logPrefix}${content}`));
        } else if (Environment.isProduction) {
            console.log(`${logPrefix}${content}`);
        } else {
            console.log(content);
        }
    }
}
