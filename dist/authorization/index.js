"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/web.dom-collections.iterator.js");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Service responsible for handling view based authorization
 * @name permission.PermAuthorization
 *
 */
class PermAuthorization {
  constructor() {
    _defineProperty(this, "authorizeByPermissionMap", map => new Promise((resolve, reject) => {
      const deferred = {
        resolve,
        reject
      };
      this.resolveExceptPrivilegeMap(deferred, map);
    }));

    _defineProperty(this, "resolveExceptPrivilegeMap", (deferred, map) => {
      const exceptPromises = map.resolvePropertyValidity(map.except);
      new Promise.any(exceptPromises).then(rejectedPermissions => {
        deferred.reject(rejectedPermissions);
      }).catch(() => {
        this.resolveOnlyPermissionMap(deferred, map);
      });
    });

    _defineProperty(this, "resolveOnlyPermissionMap", (deferred, map) => {
      if (!map.only.length) {
        deferred.resolve();
        return;
      }

      const onlyPromises = map.resolvePropertyValidity(map.only);
      $q.any(onlyPromises).then(resolvedPermissions => deferred.resolve(resolvedPermissions)).catch(rejectedPermission => deferred.reject(rejectedPermission));
    });
  }

}

var _default = new PermAuthorization();

exports.default = _default;