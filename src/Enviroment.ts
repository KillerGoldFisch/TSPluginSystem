import sig = require('./Signal');
import plugin = require('./Plugin');
import task = require('./Task');


export module PluginSystem {
    export class Enviroment {
        signals:{[name:string] : sig.PluginSystem.BaseSignal<any>};
        plugins:Array<plugin.PluginSystem.Plugin>;
        
        getTask(name:string): task.PluginSystem.Task {
            for(var i = 0 ; i < this.plugins.length ; i++)
                for(var j = 0 ; j < this.plugins[i].tasks.length ; j++)
                    if(this.plugins[i].tasks[j].name === name)
                        return this.plugins[i].tasks[j];
            return null;
        }
        
        withTask(name:string, execute:(tsk:task.PluginSystem.Task) => void) : void {
            var t = this.getTask(name);
            if(t)
                execute(t);
        }
        
        constructor() {
            this.signals = {};
            this.plugins = [];
        }
    }
}