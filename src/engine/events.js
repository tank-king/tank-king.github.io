import {Singleton} from "./objects.js";
class Event {
    constructor(name, kwargs) {
        this.name = name;
        kwargs.entries.forEach(([k, v]) => {
            this[k] = v;
        });
    }

    type(){
        return this.name;
    }
}

class EventManager extends Singleton{
    constructor() {
        super();
        this.events = [];
    }



    get() {
        const events = this.events.slice();
        this.events = [];
        return events;
    }

    post(event) {
        this.events.push(event);
    }

    poll() {
        return this.events.pop();
    }

}


export {Event, EventManager}