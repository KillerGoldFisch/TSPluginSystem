/// <reference path="../typings/node/node.d.ts" />

export module PluginSystem {
    export class Task  {
        private _step:number;
        
        private _start:(task:Task, srgs:any) => void;
        private _tick:(task:Task) => void;
        
        name:string;
        
        private _steps : Array<TaskStep>;
        
        start(args:any = null) {
            if(this._start) this._start(this, args);
            
            this._step = 1;
            this.getStep(this._step).begin();
        }
        
        addStep(step:TaskStep) {
            this._steps.push(step);
        }
        
        tick() : boolean {
            if(this._tick) this._tick(this);
            
            if(this._step <= 0)
                return false;
            
            var curStep = this.getStep(this._step);
            var next:number = curStep.do();
            
            if(next !== curStep.id) {
                this._step = next;
                if(this._step > 0)
                    this.getStep(next).begin();
            } else {
                if(curStep.isTimeout) {
                    this.reset(`Timeout in Step ${curStep.id}`);
                }
            }
            
            return this._step > 0;
        }
        
        private getStep(id:number) : TaskStep {
            for(var i = 0 ; i < this._steps.length ; i++)
                if(this._steps[i].id == id)
                    return this._steps[i]
            throw `Can't find Step id ${id} in Task "${this.name}"`;
        }
        
        private _reset:(task:Task, reason:string) => void;
        
        public reset(reason:string = "undefined") {
            if(this._reset)
                this._reset(this, reason);
            
            this.getStep(this._step).reset();
            this._step = 0;
        }
        
        constructor(name:string,
                steps:Array<TaskStep> = null,
                start:(task:Task, args:any) =>void = null,
                reset: (task:Task, reason:string) => void = null,
                tick: (task:Task) => void = null) {
            this.name = name;
            this._step = 0;
            this._reset = reset;
            this._start = start;
            if(steps)
                this._steps = steps;
        }
    }
    
    export class TaskStep {
        private _task:Task;
        get task() { return this._task; }
        
        id:number;
        
        name:String = "undefined";
        timeout:number = 5.0;
        start:number;
        time:number = 0.0;
        
        
        private _do: () => number;
        
        private _reset: () => void;
        
        public do() : number {
            var next = this.id;
            try {
                next = this._do();
            } catch (ex) {
            }
            
            this.time = (process.uptime() - this.start);
            
            return next;
        }
        
        public begin() {
            this.start = process.uptime();
        }
        
        public get isTimeout() : boolean {
            return this.time > this.timeout;
        }
        
        public reset() {
            if(this._reset)
                this._reset();
        }

        constructor(id:number, step:() => number, reset: () => void = null) {
            this.id = id;
            this._do = step;
            this._reset = reset;
        }
    }
}