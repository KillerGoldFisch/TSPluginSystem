/// <reference path="../../typings/node/node.d.ts" />

import enviroment = require('../Enviroment');
import plugin = require('../Plugin');
import signal = require('../Signal');
import task = require('../Task');

var env = new enviroment.PluginSystem.Enviroment()


env.signals["test"] = new signal.PluginSystem.BoolSignal(false);
env.signals["test"].on("change",(sig:signal.PluginSystem.BoolSignal, old:boolean) => {
    console.log(`Signal "test" changed from ${old} to ${sig.value}`)
})


env.plugins.push(
    new plugin.PluginSystem.Plugin("Test", env, [
        new task.PluginSystem.Task(
            "Test Task",
            [
                new task.PluginSystem.TaskStep(
                    1,
                    () => {
                        console.log("Step 1");
                        (env.signals["test"] as  signal.PluginSystem.BoolSignal).toggle();
                        return 2;
                    }
                ),
                new task.PluginSystem.TaskStep(
                    2,
                    () => {
                        console.log("Step 2");
                        return 0;
                    }
                )
            ],
            (task, args) => {console.log(`Task "${task.name}" started with args "${args}"`);},
            (task, reason) => console.log(`Task "${task.name}" reset because of "${reason}"`)
        )
    ])
)



var sleep = require('sleep');

env.withTask("Test Task", (tsk) => {
    tsk.start();
    
    while(tsk.tick()) {
        console.log("tick");
        sleep.sleep(1);
    }
})