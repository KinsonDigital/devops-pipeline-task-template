/**
 * Represents the different kinds of Azure Pipeline Logs.
 */
export enum LogType {
    /**
     * Logs debug messages in purple.
     */
    Debug,

    /**
     * Logs a section type of message.
     */
    Section,

    /**
     * Logs warnings in yellow.
     */
    Warning,

    /**
     * Logs errors in red.
     */
    Error,

    /**
     * No logging formatting performed.
     */
    None,
}