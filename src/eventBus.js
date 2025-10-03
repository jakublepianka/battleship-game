export const eventBus = {

    events: {},
    subscribe(eventName, callback){
        
        if(!this.events[eventName]) this.events[eventName] = []; 
        this.events[eventName].push(callback);
    },
    publish(eventName, data){
        if(this.events[eventName]){
            this.events[eventName].forEach(callback => callback(data));
        }
    },

};