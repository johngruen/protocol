/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


// create namespace
if (typeof Mozilla === 'undefined') {
    var Mozilla = {};
}

(function(doc) {
    'use strict';

    var Details = {};
    var _count = 0;

    /**
     * isSupported
     * - feature detection for HTML5 detail/summary support
     * - // https://mathiasbynens.be/notes/html5-details-jquery#comment-35
     */
    Details.isSupported = (function() {
        var el = doc.createElement('details');
        var fake;
        var root;
        var diff;
        if (!('open' in el)) {
            return false;
        }
        root = doc.body || (function() {
            var de = doc.documentElement;
            fake = true;
            return doc.insertBefore(doc.createElement('body'), de.firstElementChild || de.firstChild);
        }());
        el.innerHTML = '<summary>a</summary>b';
        el.style.display = 'block';
        root.appendChild(el);
        diff = el.offsetHeight;
        el.open = true;
        diff = diff != el.offsetHeight;
        root.removeChild(el);
        if (fake) {
            root.parentNode.removeChild(root);
        }
        return diff; //todo, how do I document return values
    }());

    /**
     * open
     * @param {String} id - id of the container to open
     */
    Details.open = function(id) {
        var control = doc.querySelector('[aria-controls=' + id + ']');
        var details = doc.getElementById(id);
        control.setAttribute('aria-expanded', true);
        details.setAttribute('aria-hidden', false);
        details.classList.remove('is-closed');
    };

    /**
     * close
     * @param {String} id - id of the container to close
     */
    Details.close = function(id) {
        var control = doc.querySelector('[aria-controls=' + id + ']');
        var details = doc.getElementById(id);
        control.setAttribute('aria-expanded', false);
        details.setAttribute('aria-hidden', true);
        details.classList.add('is-closed');
    };

    /**
     * toggle
     * @param {String} id - id of the container to toggle
     */
    Details.toggle = function(id) {
        var details = doc.getElementById(id);
        var isClosed = details.getAttribute('aria-hidden');

        if(isClosed == 'true') {
            Details.open(id);
        } else {
            Details.close(id);
        }
    };

    /**
     * handleControlActivation
     * @param {Event} e - event to handle
     */
    Details.handleControlActivation = function(e) {
        var control = e.target;
        var id = control.getAttribute('aria-controls');
        Details.toggle(id);
    };

    /**
     * initItem
     * @param {Object} el - Element to place the control inside of
     * @param {String} selector - Selector for all control wrappers
     * - assumes every sibling until the next control is associated with the control
     */
    Details.initItem = function(el, selector) {
        var summary = el;
        var control = doc.createElement('button');
        var details;
        var parent = summary.parentNode;
        var summarySiblings;

        // if it's already been initalized, don't do it again
        if(summary.querySelectorAll('button').length !== 0) {
            return;
        }

        // add class to parent to indicate js initialized
        parent.classList.add('is-details');

        // Expand
        // siblings of the summary, until next summary
        summarySiblings = window.Mozilla.Utils.nextUntil(summary, selector);

        // look to see if all children are already in a wrapper we can use
        if(summarySiblings.length == 1) {
            details = summarySiblings[0];
        } else if (summarySiblings.length > 1){
            details = doc.createElement('div');
            details.classList.add('mzp-c-details-wrapper');
            summarySiblings.forEach(function(sibling) {
                details.append(sibling);
            });

            summary.parentNode.insertBefore(details, summary.nextSibling);
        } else {
            // error
            // TODO: what do we do with errors? fail silently?
        }

        // look for existing ID to use
        if(!details.id) {
            // if details already has ID, use that, if not assign one
            var unique = selector.replace(/[^a-zA-Z]+/g, '');
            details.id = 'expand-' + unique + '-'+ _count;
            _count++;
        }

        // close by default
        // TODO: add support for open attribute
        details.setAttribute('aria-hidden', true);
        details.classList.add('is-closed');

        // Control
        control.setAttribute('type', 'button');
        // add aria-controls
        control.setAttribute('aria-controls', details.id);
        // add aria-expanded
        control.setAttribute('aria-expanded', false);
        // add listener
        control.addEventListener('click', Details.handleControlActivation, false);
        // copy the summary's contents into the control
        summary.childNodes.forEach(function(child) {
            control.append(child);
        });
        // append control element
        summary.appendChild(control);
        summary.classList.add('is-summary');
    };

    /**
     * destroyItem
     * @param {Object} el - Element the control was placed inside of
     * - does not attempt to remove the details wrapper
     */
    Details.destroyItem = function(el) {
        var summary = el;
        var parent = summary.parentNode;
        var details = summary.nextElementSibling;
        var control = summary.querySelector('button');
        parent.classList.remove('is-details');
        details.removeAttribute('aria-hidden');
        details.classList.remove('is-closed');
        // move control's contents back to summary
        control.childNodes.forEach(function(child) {
            summary.append(child);
        });
        summary.removeChild(control);
        summary.classList.remove('is-summary');
    };

    /**
     * Init
     * @param {Object} selector - CSS selector matching "summary" elements
     */
    Details.init = function(selector) {
        var summaries = doc.querySelectorAll(selector);
        // loop through controls on the page and init them one at a time
        for (var i = 0; i < summaries.length; i++) {
            Details.initItem(summaries[i], selector);
        }
    };

    /**
     * Destroy
     * @param {Object} selector - CSS selector matching "summary" elements
     */
    Details.destroy = function(selector) {
        var summaries = doc.querySelectorAll(selector);
        // loop through controls on the page and destroy them one at a time
        for (var i = 0; i < summaries.length; i++) {
            Details.destroyItem(summaries[i], selector);
        }
    };

    // init as details/summary polyfill
    if(!Details.isSupported) {
        // not supported, add support
        Details.init('summary');
        // TODO are some aria things necissary with a passing feature test? tabindex? role=button?
    }

    // init generic class indicating headings should be made into expand/collapse componenet
    Details.init('.mzp-c-details > h2');
    Details.init('.mzp-c-details > h3');
    Details.init('.mzp-c-details > h4');
    Details.init('.mzp-c-details > h5');
    Details.init('.mzp-c-details > h6');

    window.Mozilla.Details = Details;

})(document);
