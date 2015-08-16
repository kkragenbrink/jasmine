'use strict';

const net = require('net');
const util = require('util');

const AbstractCommand = require('jasmine/commands/AbstractCommand');

let privateData = new WeakMap();

class Session {
    constructor (socket) {
        if (!(socket instanceof net.Socket)) {
            throw new TypeError('socket must be an instance of net.Socket');
        }

        let intl = {
            commands : new Map(),
            socket : socket
        };
        privateData.set(this, intl);
        this._socket = socket;

        socket.on('data', this.processInput.bind(this));
    }

    get commands () {
        return privateData.get(this).commands;
    }

    close () {
        privateData.get(this).socket.end();
    }

    send () {
        this._socket.write(util.format.apply(this, arguments) + '\n');
    }

    processInput (input) {
        let buffers = input
            .toString('utf8')
            .split('\n')
            .filter(function (command) {
                return command.length > 0;
            })
            .reduce(function (collection, item) {
                collection.push(item);
                return collection;
            }, buffers);
    }

    _addCommand (cmdstr, command) {
        if (this.commands.has(cmdstr)) {
            throw new Error('Command ' + cmdstr + ' already exists.');
        }
        this.commands.set(cmdstr, command);
    }

    addCommand (command) {
        let test = new command;
        if (test instanceof AbstractCommand) {
            this._addCommand(command.command, command);
            command.aliases.forEach(function (alias) {
                this._addCommand(alias, command);
            }.bind(this));
        }
        else {
            throw new TypeError('Command must be a command.');
        }
    }

    removeCommand (command) {
        this.commands.forEach(function (v, k, commands) {
            if (v === command) {
                commands.delete(k);
            }
        });
    }
}

module.exports = Session;