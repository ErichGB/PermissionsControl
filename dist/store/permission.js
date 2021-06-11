"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _permission = _interopRequireDefault(require("../models/permission"));

var _permission2 = _interopRequireDefault(require("../store/permission"));

var _forEach = _interopRequireDefault(require("lodash/forEach"));

var _isArray = _interopRequireDefault(require("lodash/isArray"));

var _isUndefined = _interopRequireDefault(require("lodash/isUndefined"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Permission definition storage
 * @name permission.PermPermissionStore
 *
 * @param PermPermission {permission.PermPermission|Function}
 */
class PermPermissionStore {
  constructor() {
    _defineProperty(this, "definePermission", (permissionName, validationFunction) => {
      this.permissionStore[permissionName] = new _permission.default(permissionName, validationFunction);
    });

    _defineProperty(this, "defineManyPermissions", (permissionNames, validationFunction) => {
      // console.log('defineManyPermissions', validationFunction);
      if (!(0, _isArray.default)(permissionNames)) {
        throw new TypeError('Parameter "permissionNames" name must be Array');
      } // console.log(permissionNames);


      (0, _forEach.default)(permissionNames, permissionName => {
        this.definePermission(permissionName, validationFunction);
      });
    });

    _defineProperty(this, "removePermissionDefinition", permissionName => {
      delete _permission2.default[permissionName];
    });

    _defineProperty(this, "hasPermissionDefinition", permissionName => {
      return !(0, _isUndefined.default)(this.permissionStore[permissionName]);
    });

    _defineProperty(this, "getPermissionDefinition", permissionName => {
      return this.permissionStore[permissionName];
    });

    _defineProperty(this, "getStore", () => {
      return this.permissionStore;
    });

    _defineProperty(this, "clearStore", () => {
      this.permissionStore = {};
    });

    /**
     * @property permissionStore
     *
     * @type {Object}
     */
    this.permissionStore = {};
  }
  /**
   * Allows to define permission on application configuration
   * @methodOf permission.PermPermissionStore
   *
   * @param permissionName {String} Name of defined permission
   * @param validationFunction {Function} Function used to validate if permission is valid
   */


}

var _default = new PermPermissionStore();

exports.default = _default;