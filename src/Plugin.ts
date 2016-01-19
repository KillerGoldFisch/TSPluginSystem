/// <reference path="Enviroment.ts" />
/// <reference path="Task.ts" />

//import * as tasks from './Task';
//import * as env from './Enviroment';

import tasks = require("./Task");
import env = require("./Enviroment");

export module PluginSystem {
    export class Plugin {
        public _env:env.PluginSystem.Enviroment;
        public name:string;
        
        private _tasks:Array<tasks.PluginSystem.Task>;
        
        public get tasks() : Array<tasks.PluginSystem.Task> {
            return this._tasks;
        }
        
        constructor(name:string, env:env.PluginSystem.Enviroment, tasks:Array<tasks.PluginSystem.Task>) {
            this.name = name;
            this._env = env;
            this._tasks = tasks;
        }
    }
}