/*!
 *
 *  Copyright 2015-2017 Google Inc, Adam Yi. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

// TODO: switch to webpack etc.
// import {MDCDialog, MDCDialogFoundation, util} from '@material/dialog';

/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

})();

function renderPortfolio() {
  $.getJSON( "portfolio.json", function( data ) {
    var items = [];
    $.each( data, function( key, val ) {
      //TODO: classification and tag of projects
      var name = val.name;
      var abstract_text = val.abstract_text;
      var url = val.url; //TODO: project without url button
      var details = val.details; //TODO: ajax details
      var image = val.image;
      var card = "<div class=\"mdc-card adamyi-portfolio-card\"><section class=\"mdc-card__media\"";
      if (image) {
        card += " style=\"background-image: url(" + image + ");\""
      }
      card += "></section><section class=\"mdc-card__primary\"><h1 class=\"mdc-card__title mdc-card__title--large\">" + name + "</h1></section><section class=\"mdc-card__supporting-text\">" + abstract_text + "</section><section class=\"mdc-card__actions\">";
      if (url) {
        card += "<a class=\"mdc-button mdc-button--compact mdc-card__action\" href=\"" + url + "\" target=\"_blank\">Visit Site</a>"
      }
      if (details) {
        card += "<button class=\"mdc-button mdc-button--compact mdc-card__action adamyi-modal-button\" adamyi-modal-header=\"" + name + "\" adamyi-modal-details=\"" + details + "\">Read More</button>";
      }
      card += "</section></div>";
      items.push(card);
    });

    $('.adamyi-main-wide').html(items.join(""));

  });
  
  $(document).on('click', '.adamyi-modal-button', function(evt) {
    var tgt = $(evt.target);
    $('#adamyi-modal-heading-text').html(tgt.attr('adamyi-modal-header'));
    $('#adamyi-modal-details').html(tgt.attr('adamyi-modal-details'));
    $('#adamyi-modal').css("display", "block");
    $('#adamyi-modal-backdrop').css("display", "block");
    $('body').css("overflow", "hidden");
  });

  $('#adamyi-modal-backdrop').click(function() {
    $('#adamyi-modal').css("display", "none");
    $('#adamyi-modal-backdrop').css("display", "none");
    $('body').css("overflow", "auto");
  });
}

