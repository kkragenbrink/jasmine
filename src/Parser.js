/**
 * __          __   _ _   _                  _
 * \ \        / /  (_) | | |                | |
 *  \ \  /\  / / __ _| |_| |__    _ __   ___| |_
 *   \ \/  \/ / '__| | __| '_ \  | '_ \ / _ \ __|
 *    \  /\  /| |  | | |_| | | |_| | | |  __/ |_
 *     \/  \/ |_|  |_|\__|_| |_(_)_| |_|\___|\__|
 *
 * @created     2012-12-10
 * @edited      2012-12-10
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
 * Stores data about a rule.
 * @type {Object}
 * @struct
 */
var Rule = function() {
    this.name                           = null;
    this.expression                     = null;
    this.priority                       = null;
    this.handler                        = null;
};

/**
 * Converts a string into a series of tokens and types.
 */
var Parser = Class(function() {

    /**
     * Adds a rule to the list of definitions.
     * @param   {Rule}      rule
     * @return  {undefined}
     */
    this.addRule = Public(function(rule) {

        if (this.validateRule(rule)) {
            var added                   = false;

            for (var i in this.rules) {
                if (this.rules[i].priority > rule.priority) {
                    this.rules.splice(i, 0, rule);
                    added               = true;
                }
            }

            if (!added) {
                this.rules.push(rule);
            }
        }
        else {
            throw new Error('Rule is invalid.');
        }
    });

    /**
     * Validates that a rule is fully formed and usable.
     * @param   {Rule}      rule
     * @return  {Bool}
     */
    this.validateRule = Protected(function(rule) {
        if (!(rule instanceof Rule)) {
            return false;
        }

        if (!Classical.type.STRING(rule.name)) {
            return false;
        }

        if (!(rule.expression instanceof RegExp)) {
            return false;
        }

        if (!Classical.type.FLOAT(rule.priority)) {
            return false;
        }

        if (!Classical.type.FUNCTION(rule.handler)) {
            return false;
        }

        return true;
    });

    /**
     * Returns the current rules.
     * @return  {Rule[]}
     */
    this.getRules = Public(function() {
        return this.rules;
    });

    this.stack                          = Protected([]);
    this.rules                          = Protected([]);
});

module.exports                          = Parser;
module.exports.Rule                     = Rule;