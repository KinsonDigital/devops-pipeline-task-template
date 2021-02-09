/**
 * Holds task input data.
 * @summary This is the schema for the objects in the inputs array in the task.json file.
 */
export interface Input {
    /**
     * The name of the input.
     */
    name: string,
    
    /**
     * The data type of the input value.
     * @summary Can be string, string[], boolean and undefined
     */
    type: string,

    /**
     * The input description/label displayed in Azure Pipelines.
     */
    label: string,

    /**
     * The default value of the input.
     */
    defaultValue: string,

    /**
     * True if the value for the input must be supplied.
     */
    required: boolean,

    /**
     * Help documentation in mark down format.
     */
    helpMarkDown: string,

    /**
     * The value of the input.
     * @summary This is not part of the task.json schema and is used only internally to the task.
     */
    value: string | boolean,
}