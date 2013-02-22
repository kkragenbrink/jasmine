/**
 * __          __   _ _   _                  _
 * \ \        / /  (_) | | |                | |
 *  \ \  /\  / / __ _| |_| |__    _ __   ___| |_
 *   \ \/  \/ / '__| | __| '_ \  | '_ \ / _ \ __|
 *    \  /\  /| |  | | |_| | | |_| | | |  __/ |_
 *     \/  \/ |_|  |_|\__|_| |_(_)_| |_|\___|\__|
 *
 * @created     2013-01-23
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
var Log                                 = require(BASE_PATH + '/src/Log').getLogger('Auth.Login');
var Session                             = require(BASE_PATH + '/src/Session');
var User                                = require('../../model/User');

/**
 * A command to enable players to authenticate their login as a specific user.
 *
 * @class       Login
 * @subpackage  Auth
 */
var Login = Implement(Command, function() {

    this.expression                     = Static(Public(/^(?:login|connect) ("(?:\w| )+"|\w+) (.+)$/i));

    this.run = Public(function(session, phrase, callback) {
        Log.debug('run');

        var parts                       = this.expression.exec(phrase);
        var username                    = new RegExp(parts[1], 'i');
        var password                    = parts[2];

        this.session                    = session;
        this.callback                   = callback;
        this.password                   = User.hashPassword(password);

        User.findOne({$or : [
            {name   : {$regex : username}},
            {alias  : {$regex : username}}
        ]}, this.validatePassword);
    });

    this.validatePassword = Protected(function(err, user) {
        Log.debug('validatePassword');

        if (user === null || this.password !== user.password) {
            Dust.render("Auth.BadLogin", {}, this.emit);
        }
        else {
            Log.debug('successful login');

            this.session.data.moniker   = user.name;
            this.session.data.user      = user;
            this.session.setStatus(Session.Status.CONNECTED);

            Dust.render("Auth.Connected", user, this.emit)
        }
    });

    this.emit = Protected(function(err, out) {
        Controller.prepare('Emit', this.session, out);
    });

    this.session                        = Protected({});
    this.password                       = Protected(null);
    this.instructions                   = Protected([]);
});

module.exports                          = Login;
