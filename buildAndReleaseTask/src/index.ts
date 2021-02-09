import { TaskResult, setResult } from "azure-pipelines-task-lib";
import { BuildReleaseTask } from "./BuildReleaseTask";

const task: BuildReleaseTask = new BuildReleaseTask();

task.initAsync().then(async () => {
    await task.runAsync().then((response: void) => {
        setResult(TaskResult.Succeeded, "Postman Runner Finished");
    }).catch((error: Error) => {
        setResult(TaskResult.Failed, error.message);
    });
}).catch((error: Error) => {
    setResult(TaskResult.Failed, error.message);
});
