import { is, log } from "./utils"; 

class SagaMonitorRegistry{
    constructor(){
        this.effectTriggered = [];
        this.effectResolved = [];
        this.effectRejected = [];
        this.effectCancelled = [];
        this.actionDispatched = [];
    }

    register(moniter){
        if(!moniter || !is.object(moniter)){
            throw new Error("SagaMoniterRegistry.register: Invalid moniter");
        }
        if(is.func(moniter.effectTriggered)){
            this.effectTriggered.push(moniter.effectTriggered);
        }
        if(is.func(moniter.effectResolved)){
            this.effectResolved.push(moniter.effectResolved);
        }
        if(is.func(moniter.effectRejected)){
            this.effectRejected.push(moniter.effectRejected);
        }
        if(is.func(moniter.effectCancelled)){
            this.effectCancelled.push(moniter.effectCancelled);
        }
        if(is.func(moniter.actionDispatched)){
            this.actionDispatched.push(moniter.actionDispatched);
        }
    }

    deregister(moniter){
        if(!moniter || !is.object(moniter)){
            throw new Error("SagaMoniterRegistry.deregister: Invalid moniter");
        }
        if(is.func(moniter.effectTriggered)){
            this.effectTriggered = this.effectTriggered.filter(item => item !== moniter.effectTriggered);
        }
        if(is.func(moniter.effectResolved)){
            this.effectResolved = this.effectResolved.filter(item => item !== moniter.effectResolved);
        }
        if(is.func(moniter.effectRejected)){
            this.effectRejected = this.effectRejected.filter(item => item !== moniter.effectRejected);
        }
        if(is.func(moniter.effectCancelled)){
            this.effectCancelled = this.effectCancelled.filter(item => item !== moniter.effectCancelled);
        }
        if(is.func(moniter.actionDispatched)){
            this.actionDispatched = this.actionDispatched.filter(item => item !== moniter.actionDispatched);
        }
    }

    destroy(){
        this.effectTriggered = [];
        this.effectResolved = [];
        this.effectRejected = [];
        this.effectCancelled = [];
        this.actionDispatched = [];
    }

    getCombinedMonitor(){
        return {
            effectTriggered: options => {
                if(!this.effectTriggered.length) return;
                this.effectTriggered.forEach(item=>{
                    try{
                        item(options);
                    }catch(e){
                        log("Error when executing saga moniter `effectTriggered`.", "error", e);
                    }
                });
            },
            effectResolved: (effectId, res) => {
                if(!this.effectResolved.length) return;
                this.effectResolved.forEach(item=>{
                    try{
                        item(effectId, res);
                    }catch(e){
                        log("Error when executing saga moniter `effectResolved`.", "error", e);
                    }
                });
            },
            effectRejected: (effectId, res) => {
                if(!this.effectRejected.length) return;
                this.effectRejected.forEach(item=>{
                    try{
                        item(effectId, res);
                    }catch(e){
                        log("Error when executing saga moniter `effectRejected`.", "error", e);
                    }
                });
            },
            effectCancelled: (effectId) => {
                if(!this.effectCancelled.length) return;
                this.effectCancelled.forEach(item=>{
                    try{
                        item(effectId);
                    }catch(e){
                        log("Error when executing saga moniter `effectCancelled`.", "error", e);
                    }
                });
            },
            actionDispatched: (action) => {
                if(!this.actionDispatched.length) return;
                this.actionDispatched.forEach(item=>{
                    try{
                        item(action);
                    }catch(e){
                        log("Error when executing saga moniter `actionDispatched`.", "error", e);
                    }
                });
            }
        };
    }
}

export default SagaMonitorRegistry;