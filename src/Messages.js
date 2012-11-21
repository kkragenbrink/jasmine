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
var Dust                                = require('dustjs-linkedin');
var Util                                = require(BASE_PATH + '/src/Utilities');
var YAML                                = require('js-yaml');

var messagesConfig                      = require(BASE_PATH + '/config/messages.yml');

/**
 * A central messages class.
 * @singleton
 */
var Messages = Extend(Dust, function() {
    this.instance                       = Static(Public({}));
    this.messages                       = Protected({});

    /**
     * Loads the messages from config.
     * @constructor
     */
    this.constructor = Protected(function() {
        this.load(messagesConfig);
    });

    /**
     * Returns the singleton of the class.
     * @static
     * @return  {Messages}
     */
    this.getInstance = Static(Public(function() {
        if (!(this.instance instanceof Messages)) {
            this.instance               = new Messages;
        }
        return this.instance;
    }));

    /**
     * Compiles and registers message templates.
     * @param   {Object}    messages        The message templates to compile and register.
     * @return  {undefined}
     */
    this.load = Public(function(messages) {
        for (var i in messages) {
            if (messages.hasOwnProperty(i)) {
                this.messages[i]        = this.compile(messages[i], i);
                this.loadSource(this.messages[i]);
            }
        }
    });
});

module.exports                          = Messages.getInstance();