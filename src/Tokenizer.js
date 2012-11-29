/**
 * __          __   _ _   _                  _
 * \ \        / /  (_) | | |                | |
 *  \ \  /\  / / __ _| |_| |__    _ __   ___| |_
 *   \ \/  \/ / '__| | __| '_ \  | '_ \ / _ \ __|
 *    \  /\  /| |  | | |_| | | |_| | | |  __/ |_
 *     \/  \/ |_|  |_|\__|_| |_(_)_| |_|\___|\__|
 *
 * @created     2012-11-28
 * @edited      2012-11-28
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
var Log                                 = require(BASE_PATH + '/src/Log').getLogger('Tokenizer');
var Util                                = require(BASE_PATH + '/src/Utilities');

/**
 * Holds data about a tokenized value from the parser.
 * @type {Object}
 * @enum
 */
var Token = function(value, type) {
    this.value                          = value;
    this.type                           = type;
    return this;
};

/**
 * Converts a string into a series of tokens and types.
 */
var Tokenizer = Class(function() {

    /**
     * Prepares the tokenizer for string handling.
     * @param   {Object}    definitions     A series of named regular expressions used to tokenize the string.
     */
    this.constructor = Public(function(definitions) {
        Log.debug('constructor');
        this.types                      = definitions;
    });

    /**
     * Flushes the remaining stream.
     * @return {undefined}
     */
    this.flush = Public(function() {
        this.stream                     = '';
    });

    /**
     * Returns the remaining stream.
     * @return  {String}
     */
    this.getStream = Public(function() {
        Log.debug('getStream');
        return this.stream;
    });

    /**
     * Appends to the stream being tokenized.
     * @param   {String}    input       The stream to be tokenized.
     */
    this.prepare = Public(function(input) {
        Log.debug('prepare', input);

        this.stream                    += input;
    });

    /**
     * Advances the next stream to the end of the next token and returns that token.
     * @return  {Token}
     */
    this.getNextToken = Public(function() {
        Log.debug('getNextToken');

        if (this.stream === null || this.stream.length === 0) {
            return this.EOSTOKEN;
        }

        for (var type in this.types) {
            if (this.types.hasOwnProperty(type)) {
                var expression          = this.types[type];
                var matches             = expression.exec(this.stream);

                if (matches) {
                    var match           = matches[1];
                    this.stream         = this.stream.substring(this.stream.indexOf(match) + match.length);
                    return new Token(match, type);
                }
            }
        }

        throw new Error('Tokenizer error');
    });

    this.EOSTOKEN                       = Static(Public(new Token(null, 'EOS')));
    this.stream                         = Protected('');
    this.types                          = Protected({})
});

module.exports                          = Tokenizer;
module.exports.Token                    = Token;