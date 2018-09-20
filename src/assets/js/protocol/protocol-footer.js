/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
    'use strict';

    var _mqWide = matchMedia('(max-width: 479px)');

    if (_mqWide.matches) {
        window.Mozilla.Details.init('.mzp-c-footer-sections .mzp-c-footer-heading');
    }

    _mqWide.addListener(function(mq) {
        if (mq.matches) {
            window.Mozilla.Details.init('.mzp-c-footer-sections .mzp-c-footer-heading');
        } else {
            window.Mozilla.Details.destroy('.mzp-c-footer-sections .mzp-c-footer-heading');
        }
    });
})();
