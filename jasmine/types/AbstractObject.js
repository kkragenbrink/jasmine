'use strict';

const util = require('util');

const Database = require('jasmine/Database');

class AbstractObject {
    constructor (db) {
        if (this.constructor === AbstractObject) {
            throw new TypeError('Cannot construct Abstract instances directly.');
        }

        // todo: this.command_set = jasmine.CommandSet

        if (db instanceof Database) { this._db = db; }
        else { this._db = new Database; }

        this._sessions = new Map;
    }

    /**
     * The database object associated with this object.
     * @returns {*}
     */
    get db () {
        return this._db;
    }

    /**
     * Returns the dbref for this object.
     * @returns {String}
     */
    get dbref () {
        return util.format('#%d', this.db.dbref);
    }

    /**
     * The set of sessions associated with this object.
     * Usually empty.
     * @returns {Array}
     */
    get sessions () {
        return this._sessions;
    }

    /**
     * Convenience method to check whether an object is being actively controlled.
     * @returns {boolean}
     */
    hasPlayer () {
        return this.sessions.size > 0;
    }

    send (message, from) {
        this.at_receive(message, from);
    }

    search (query) {
        return Database.find(query);
    }

    /**
     * HOOK METHODS
     * These may optionally be implemented.
     */
    at_receive (/* message, from */) {}
}

module.exports = AbstractObject;