var checkoutExternalUrl = '/checkout-external';

window.EB = window.EB || {};


EB.EvidonConsent = (function () {
    return {
        _flattenEvidonStore: function(obj, acc, cb) {
            var index, to, nextSource, nextKey;

            Object.keys(obj).forEach(function(key) {
                typeof obj[key] === 'object' ? cb(obj[key], acc, cb) : acc.push({[key]: obj[key]});
                }
            );
            
            // ES5 polyfill for supporting IE11 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
            if (typeof Object.assign !== 'function') {
                Object.defineProperty(Object, 'assign', {
                  value: function assign(target) {
                    'use strict';
                    if (target === null || target === undefined) {
                      throw new TypeError('Cannot convert undefined or null to object');
                    }
              
                    to = Object(target);
              
                    for (index = 1; index < arguments.length; index++) {
                      nextSource = arguments[index];
              
                      if (nextSource !== null && nextSource !== undefined) { 
                        for (nextKey in nextSource) {
                          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                          }
                        }
                      }
                    }
                    return to;
                  },
                  writable: true,
                  configurable: true
                });
              }

            return acc.reduce(function(acc, obj) {
               return Object.assign(acc, obj);
            }, {});
        },
        shouldDisableEvidon: function() {
            return window.location.pathname === checkoutExternalUrl;
        },
        hasEvidonConsent: function(category) {
            var i = 0, evidonConsentFlags = {};

            for (i;i<window.localStorage.length;i++) {
                if (/^_evidon_consent_ls_\d+/.test(window.localStorage.key(i))) {
                    evidonConsentFlags = this._flattenEvidonStore(
                        JSON.parse(window.localStorage.getItem(window.localStorage.key(i))),
                        [],
                        this._flattenEvidonStore
                    );
                };
            }

            if (this.shouldDisableEvidon() || evidonConsentFlags[category]) {
                return true;
            }
            else {
                return false;
            }
        }
    };
})();
