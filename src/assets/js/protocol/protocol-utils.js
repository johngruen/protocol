/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


// create namespace
if (typeof Mozilla === 'undefined') {
    var Mozilla = {};
}

(function() {
    'use strict';

    var Utils = {};

    // matches() polyfill
    // TODO: where should this go?
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    /**
     * wrapAll
     * @param {Object} el - Element that you want to get the siblings of
     * @param {String} selector - Selector of the element you want to stop collecting siblings before
     * @param {String} filter - Selector to filter results if you only want siblings matching this pattern
     * - https://gomakethings.com/how-to-get-all-sibling-elements-until-a-match-is-found-with-vanilla-javascript/
     */
    Utils.nextUntil = function (el, selector, filter) { //TODO: captialization of nextUntil?
        // Setup siblings array
        var siblings = [];

        // Get the next sibling element
        el = el.nextElementSibling;

        // As long as a sibling exists
        while (el) {

            // If we've reached our match, bail
            if (el.matches(selector)) break;

            // If filtering by a selector, check if the sibling matches
            if (filter && !el.matches(filter)) {
                el = el.nextElementSibling;
                continue;
            }

            // Otherwise, push it to the siblings array
            siblings.push(el);

            // Get the next sibling element
            el = el.nextElementSibling;
        }

        return siblings;
    };

    window.Mozilla.Utils = Utils;
})();
