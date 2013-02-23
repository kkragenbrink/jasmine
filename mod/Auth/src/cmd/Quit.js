/**
 * __          __   _ _   _                  _
 * \ \        / /  (_) | | |                | |
 *  \ \  /\  / / __ _| |_| |__    _ __   ___| |_
 *   \ \/  \/ / '__| | __| '_ \  | '_ \ / _ \ __|
 *    \  /\  /| |  | | |_| | | |_| | | |  __/ |_
 *     \/  \/ |_|  |_|\__|_| |_(_)_| |_|\___|\__|
 *
 * @created     2013-02-22
 * @edited      2013-02-22
 * @package     JaSMINE
 * @see         https://github.com/Writh/jasmine
 *
 * Copyright (C) 2013 Kevin Kragenbrink <kevin@writh.net>
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

/** @ignore */
var Classical                           = require('classical');
var Command                             = require(BASE_PATH + '/hdr/Command');
var Controller                          = require(BASE_PATH + '/src/Controller');
var Dust                                = require('dustjs-linkedin');
var Log                                 = require(BASE_PATH + '/src/Log').getLogger('Auth.Quit');
var Session                             = require(BASE_PATH + '/src/Session');
var User                                = require('../../model/User');

/**
 * Gracefully terminates a session.
 *
 * @class       Quit
 * @subpackage  Auth
 */
var Quit = Implement(Command, function() {

    this.expression                     = Static(Public(/^QUIT$/));

    this.run = Public(function(session, phrase, callback) {
        Log.debug('run');

        this.session                    = session;
        this.callback                   = callback;

        Dust.render('Auth.Disonnected', {}, this.handleRendered);
    });

    /**
     * Emits the disconnect message, then terminates the session.
     *
     * @name    Quit#handleRendered
     * @protected
     * @method
     * @param   {Error}                 err
     * @param   {String}                out
     */
    this.handleRendered = Protected(function(err, out) {
        Log.debug('emit');

        Controller.prepare('Send',          this.session,   out);
        Controller.prepare('Disconnect',    this.session);
        Controller.prepare('Synchronize',   this.callback);
    });

    this.session                        = Protected({});
    this.callback                       = Protected(function() {});
});

module.exports                          = Quit;
