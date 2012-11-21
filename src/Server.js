/**
 * __          __   _ _   _                  _
 * \ \        / /  (_) | | |                | |
 *  \ \  /\  / / __ _| |_| |__    _ __   ___| |_
 *   \ \/  \/ / '__| | __| '_ \  | '_ \ / _ \ __|
 *    \  /\  /| |  | | |_| | | |_| | | |  __/ |_
 *     \/  \/ |_|  |_|\__|_| |_(_)_| |_|\___|\__|
 *
 * @created     2012-11-21
 * @edited      2012-11-21
 * @package     Nodem
 * @see         https://github.com/Writh/nodem
 *
 * Copyright (C) 2012 Kevin Kragenbrink <kevin@writh.net>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

var Classical                           = require('classical');
var Messages                            = require(BASE_PATH + '/src/Messages');
var Net                                 = require('net');
var Session                             = require(BASE_PATH + '/src/Session');
var Util                                = require(BASE_PATH + '/src/Utilities');

/**
 * The telnet server
 */
var Server = Class(function() {
    this.options                        = Protected({});
    this.server                         = Protected({});

    /**
     * Loads the options and messages, then creates a socket server.
     *
     * If the options are specified, it will override the options in game.yml;
     * this is useful for unit tests, but probably won't see production use.
     *
     * @param   {Object}        options     Options overrides.
     * @constructor
     */
    this.constructor = Public(function(options) {
        this.options                    = Util.extend(require(BASE_PATH + '/config/game.yml'), options);

        this.server                     = Net.createServer();
        this.server.on('connection', this.handleConnection);
        this.server.listen(this.options.port);
    });

    /**
     * Handles new socket connections.
     *
     * Incoming sockets are translated to the Socket wrapper (which assigns a
     * data handler) before they are sent the connect message.
     *
     * @param   {Net.Socket}    socket      The incoming socket.
     * @return  {undefined}
     */
    this.handleConnection = Public(function(socket) {

        // Create the session object.
        var session                     = new Session(socket);

        // Acknowledge the connection.
        session.getSocket().emit('login');

        // Set the timeout.
        session.getSocket().setTimeout(this.options.timeout.connect);

        // TODO: Set up the login parser.
        //session.getSocket().on('data', session.parseLoginData);

        // Send the connect message to the session.
        Messages.render('connect', this.options, function(err, out) {
            session.send(out);
        });
    });
});

module.exports                          = Server;