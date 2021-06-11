"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _map = _interopRequireDefault(require("../authorization/map"));

var _extend = _interopRequireDefault(require("lodash/extend"));

var _forEach = _interopRequireDefault(require("lodash/forEach"));

var _isUndefined = _interopRequireDefault(require("lodash/isUndefined"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// helpers

/**
 * State Access rights map factory
 * @function
 * @name permission.ui.PermStatePermissionMap
 *
 * @param PermPermissionMap {permission.PermPermissionMap|Function}
 *
 * @return {permission.ui.PermStatePermissionMap}
 */
const PermStatePermissionMap = () => {
  StatePermissionMap.prototype = new _map.default();
  /**
   * Constructs map instructing authorization service how to handle authorizing
   * @constructor permission.ui.PermStatePermissionMap
   * @extends permission.PermPermissionMap
   */

  function StatePermissionMap(state) {
    const toStateObject = state.$$state();
    const toStatePath = toStateObject.path;
    (0, _forEach.default)(toStatePath, state => {
      if (areSetStatePermissions(state)) {
        const permissionMap = new _map.default(state.data.permissions);
        this.extendPermissionMap(permissionMap);
      }
    });
  }
  /**
   * Extends permission map by pushing to it state's permissions
   * @methodOf permission.ui.StatePermissionMap
   *
   * @param permissionMap {permission.PermPermissionMap} Compensated permission map
   */


  StatePermissionMap.prototype.extendPermissionMap = function (permissionMap) {
    if (permissionMap.only.length) {
      this.only = this.only.concat([permissionMap.only]);
    }

    if (permissionMap.except.length) {
      this.except = this.except.concat([permissionMap.except]);
    }

    if (!(0, _isUndefined.default)(permissionMap.redirectTo)) {
      this.redirectTo = (0, _extend.default)({}, this.redirectTo, permissionMap.redirectTo);
    }
  };
  /**
   * Checks if state has set permissions
   * We check for hasOwnProperty, because ui-router lets the `data` property inherit from its parent
   * @methodOf permission.ui.StatePermissionMap
   * @private
   *
   * @returns {boolean}
   */


  function areSetStatePermissions(state) {
    try {
      return Object.prototype.hasOwnProperty.call(state.data, 'permissions');
    } catch (e) {
      return false;
    }
  }

  return StatePermissionMap;
};

var _default = PermStatePermissionMap();

exports.default = _default;