/// <reference path="../typings/eventemitter3/eventemitter3.d.ts" />

import EventEmitter = require('eventemitter3');

export module PluginSystem {
    export class BaseSignal<T> extends EventEmitter {
        private _value:T;
        
        get value(): T {
            return this._value;
        }
        
        set value(newValue:T) {
            if(newValue !== this._value) {
                var tmpVal = this._value;
                this._value = newValue;
                this.emit("change", this, tmpVal);
            }
        }
        
        constructor(initValue:T) {
            super();
            this._value = initValue;
        }
    }

    export class BoolSignal extends BaseSignal<boolean> {
        constructor(initValue:boolean = false) {
            super(initValue);
        }
        
        toggle() {
            this.value = !this.value;
        }
    }
}