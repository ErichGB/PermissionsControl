"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

var _role = _interopRequireDefault(require("../store/role"));

var _permission = _interopRequireDefault(require("../store/permission"));

var _transitionProperties = _interopRequireDefault(require("../transitionProperties"));

var _forEach = _interopRequireDefault(require("lodash/forEach"));

var _isArray = _interopRequireDefault(require("lodash/isArray"));

var _isString = _interopRequireDefault(require("lodash/isString"));

var _isObject = _interopRequireDefault(require("lodash/isObject"));

var _isFunction = _interopRequireDefault(require("lodash/isFunction"));

var _isUndefined = _interopRequireDefault(require("lodash/isUndefined"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// helpers

/**
 * Access rights map factory
 * @name permission.PermPermissionMap
 *
 * @param $permission {Object} Permission module configuration object
 * @param PermTransitionProperties {permission.PermTransitionProperties} Helper storing ui-router transition parameters
 * @param PermRoleStore {permission.PermRoleStore} Role definition storage
 * @param PermPermissionStore {permission.PermPermissionStore} Permission definition storage
 *
 * @return {permission.PermissionMap}
 */
const PermPermissionMap = () => {
  /**
   * Constructs map object instructing authorization service how to handle authorizing
   * @constructor permission.PermissionMap
   *
   * @param [permissionMap] {Object} Map of permissions provided to authorization service
   * @param [permissionMap.only] {String|Array|Function} List of exclusive access right names allowed for
   *   authorization
   * @param [permissionMap.except] {String|Array|Function} List of exclusive access right names denied for
   *   authorization
   * @param [permissionMap.redirectTo] {String|Function|Object|promise} Handling redirection when rejected
   *   authorization
   */
  function PermissionMap(permissionMap) {
    // Suppress not defined object errors
    permissionMap = permissionMap || {};
    this.only = normalizeOnlyAndExceptProperty(permissionMap.only);
    this.except = normalizeOnlyAndExceptProperty(permissionMap.except);
    this.redirectTo = normalizeRedirectToProperty(permissionMap.redirectTo);
  }
  /**
   * Redirects to fallback states when permissions fail
   * @methodOf permission.PermissionMap
   *
   * @param [rejectedPermissionName] {String} Permission name
   *
   * @return {Promise}
   */


  PermissionMap.prototype.resolveRedirectState = function (rejectedPermissionName) {
    // If redirectTo definition is not found stay where you are
    if ((0, _isUndefined.default)(this.redirectTo)) {
      return Promise.reject();
    }

    const redirectState = this.redirectTo[rejectedPermissionName] || this.redirectTo['default'];
    return resolveRedirectState(redirectState, rejectedPermissionName);
  };
  /**
   * Resolves weather permissions set for "only" or "except" property are valid
   * @methodOf permission.PermissionMap
   *
   * @param property {Array} "only" or "except" map property
   *
   * @return {Array<Promise>}
   */


  PermissionMap.prototype.resolvePropertyValidity = function (property) {
    return property.map(function (privilegeName) {
      if (_role.default.hasRoleDefinition(privilegeName)) {
        const role = _role.default.getRoleDefinition(privilegeName);

        return role.validateRole();
      }

      if (_permission.default.hasPermissionDefinition(privilegeName)) {
        const permission = _permission.default.getPermissionDefinition(privilegeName);

        return permission.validatePermission();
      } // if (!$permission.suppressUndefinedPermissionWarning) {
      // $log.warn('Permission or role ' + privilegeName + ' was not defined.');
      // }


      return Promise.reject(privilegeName);
    });
  };
  /**
   * Handles function based redirection for rejected permissions
   * @methodOf permission.PermissionMap
   *
   * @throws {TypeError}
   *
   * @param redirectFunction {Function} Redirection function
   * @param rejectedPermissionName {String} Rejected permission
   *
   * @return {Promise}
   */


  function resolveRedirectState(redirectFunction, rejectedPermissionName) {
    // const p = { rejectedPermission: rejectedPermissionName, transitionProperties: PermTransitionProperties };
    // console.log(redirectFunction, rejectedPermissionName);
    return Promise.resolve(redirectFunction(rejectedPermissionName, _transitionProperties.default)).then(redirectState => {
      if ((0, _isString.default)(redirectState)) {
        return {
          state: redirectState
        };
      }

      if ((0, _isObject.default)(redirectState)) {
        return redirectState;
      }

      return Promise.reject();
    });
  }
  /**
   * Handles extraction of permission map "only" and "except" properties and converts them into array objects
   * @methodOf permission.PermissionMap
   * @private
   *
   * @param property {String|Array|Function} PermPermission map property "only" or "except"
   *
   * @returns {Array<String>} Array of permission "only" or "except" names
   */


  function normalizeOnlyAndExceptProperty(property) {
    if ((0, _isString.default)(property)) {
      return [property];
    }

    if ((0, _isArray.default)(property)) {
      return property;
    }

    if ((0, _isFunction.default)(property)) {
      return property.call(null);
    }

    return [];
  }
  /**
   * Convert user provided input into key value dictionary with permission/role name as a key and injectable resolver
   * function as a value
   * @methodOf permission.PermissionMap
   * @private
   *
   * @param redirectTo {String|Function|Array|Object} PermPermission map property "redirectTo"
   *
   * @returns {Object<String, Object>} Redirection dictionary object
   */


  function normalizeRedirectToProperty(redirectTo) {
    if ((0, _isUndefined.default)(redirectTo)) {
      return;
    }

    if ((0, _isFunction.default)(redirectTo)) {
      return normalizeFunctionRedirectionRule(redirectTo);
    }

    if ((0, _isObject.default)(redirectTo)) {
      if (isObjectSingleRedirectionRule(redirectTo)) {
        return normalizeObjectSingleRedirectionRule(redirectTo);
      }

      return normalizeObjectMultipleRedirectionRule(redirectTo);
    }

    if ((0, _isString.default)(redirectTo)) {
      return normalizeStringRedirectionRule(redirectTo);
    }

    throw new ReferenceError('Property "redirectTo" must be String, Function, Array or Object');
  }
  /**
   * Convert string redirection rule into single-element redirection dictionary
   * @methodOf permission.PermissionMap
   * @private
   *
   * @param redirectTo {String} PermPermission map property "redirectTo"
   *
   * @returns {Object<String, Object>} Redirection dictionary object
   */


  function normalizeStringRedirectionRule(redirectTo) {
    const redirectionMap = {};

    redirectionMap.default = () => ({
      state: redirectTo
    });

    return redirectionMap;
  }
  /**
   * Checks if redirection object is single rule type
   * @methodOf permission.PermissionMap
   * @private
   *
   * @param redirectTo {Object} PermPermission map property "redirectTo"
   *
   * @returns {boolean}
   */


  function isObjectSingleRedirectionRule(redirectTo) {
    return !(0, _isUndefined.default)(redirectTo.state);
  }
  /**
   * Convert single redirection rule object into single-element redirection dictionary
   * @methodOf permission.PermissionMap
   * @private
   *
   * @param redirectTo {Object} PermPermission map property "redirectTo"
   *
   * @returns {Object<String, Object>} Redirection dictionary object
   */


  function normalizeObjectSingleRedirectionRule(redirectTo) {
    const redirectionMap = {};

    redirectionMap.default = function () {
      return redirectTo;
    };

    return redirectionMap;
  }
  /**
   * Convert multiple redirection rule object into redirection dictionary
   * @methodOf permission.PermissionMap
   * @private
   *
   * @param redirectTo {Object} PermPermission map property "redirectTo"
   *
   * @returns {Object<String, Object>} Redirection dictionary object
   */


  function normalizeObjectMultipleRedirectionRule(redirectTo) {
    const redirectionMap = {};
    (0, _forEach.default)(redirectTo, (redirection, permission) => {
      if ((0, _isFunction.default)(redirection)) {
        redirectionMap[permission] = redirection;
      }

      if ((0, _isObject.default)(redirection)) {
        redirectionMap[permission] = () => redirection;
      }

      if ((0, _isString.default)(redirection)) {
        redirectionMap[permission] = () => ({
          state: redirection
        });
      }
    });
    return redirectionMap;
  }
  /**
   * Convert function redirection rule into redirection dictionary
   * @methodOf permission.PermissionMap
   * @private
   *
   * @param redirectTo {Function} PermPermission map property "redirectTo"
   *
   * @returns {Object<String, Object>} Redirection dictionary object
   */


  function normalizeFunctionRedirectionRule(redirectTo) {
    const redirectionMap = {};
    redirectionMap.default = redirectTo; // if (isUndefined(redirectTo)) {
    //     redirectionMap.default = rejectedPermission;
    // }

    return redirectionMap;
  }

  return PermissionMap;
};

var _default = PermPermissionMap();

exports.default = _default;