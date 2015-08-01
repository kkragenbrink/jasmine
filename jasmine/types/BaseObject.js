'use strict';

const AbstractObject = require('jasmine/types/AbstractObject');

class BasePlayer extends AbstractObject {
    constructor() {
        super();

        this.db.object_type = 'jasmine/types/BasePlayer';
        this._contents = [];
    }

    /**
     * The set of contents associated with this object.
     * @returns {Array}
     */
    get contents () {
        return this._contents;
    }

    /**
     * The location object for the location of this object.
     * @returns {*}
     */
    get location () {
        return this.db.location;
    }

    set location (object) {
        if (!(object instanceof AbstractObject)) {
            throw new TypeError('Invalid location.');
        }
        this.db.location = object;
    }

    /**
     * Places an object inside of this object.
     * @param object
     */
    enter (object) {
        // todo: Implement locks
        let from = object.db.location;

        this._contents.push(object);
        object.db.location = this;

        if (from instanceof AbstractObject) {
            from.leave(object, this);
        }

        this.at_enter(object, from);
    }

    /**
     * Removes an object from this object; called automatically by 'enter'.
     * @param object
     * @param to
     */
    leave (object, to) {
        const idx = this._contents.indexOf(object);
        if (idx > -1) {
            this._contents.splice(idx, 1);
            this.at_leave(object, to);
        }
    }

    /**
     * HOOK METHODS
     * These may optionally be implemented.
     */
    at_enter(object, from) {}
    at_leave(object, to) {}
}

module.exports = BasePlayer;