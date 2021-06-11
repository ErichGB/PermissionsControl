"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

var _transitionProperties = _interopRequireDefault(require("../transitionProperties"));

var _isArray = _interopRequireDefault(require("lodash/isArray"));

var _isString = _interopRequireDefault(require("lodash/isString"));

var _isFunction = _interopRequireDefault(require("lodash/isFunction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// helpers
// import invoke from 'lodash/invoke';

/**
 * PermPermission definition factory
 * @function
 *
 * @param PermTransitionProperties {permission.PermTransitionProperties} Helper storing ui-router transition parameters
 *
 * @return {Permission}
 */
function PermPermission() {
  /**
   * PermPermission definition object constructor
   * @constructor Permission
   *
   * @param permissionName {String} Name repressing permission
   * @param validationFunction {Function} Function used to check if permission is valid
   */
  function Permission(permissionName, validationFunction) {
    validateConstructor(permissionName, validationFunction);
    this.permissionName = permissionName;
    this.validationFunction = validationFunction;
  }
  /**
   * Checks if permission is still valid
   * @methodOf permission.Permission
   *
   * @returns {Promise}
   */


  Permission.prototype.validatePermission = function () {
    let validationResult = this.validationFunction(this.permissionName, _transitionProperties.default);

    if (!(0, _isFunction.default)(validationResult.then)) {
      validationResult = wrapInPromise(validationResult, this.permissionName);
    }

    return validationResult;
  };
  /**
   * Converts a value into a promise, if the value is truthy it resolves it, otherwise it rejects it
   * @methodOf permission.Permission
   * @private
   *
   * @param result {Boolean} Function to be wrapped into promise
   * @param permissionName {String} Returned value in promise
   *
   * @return {Promise}
   */


  function wrapInPromise(result, permissionName) {
    if (result) {
      return Promise.resolve(permissionName);
    }

    return Promise.reject(permissionName);
  }
  /**
   * Checks if provided permission has accepted parameter types
   * @methodOf permission.Permission
   * @private
   *
   * @throws {TypeError}
   *
   * @param permissionName {String} Name repressing permission
   * @param validationFunction {Function} Function used to check if permission is valid
   */


  function validateConstructor(permissionName, validationFunction) {
    if (!(0, _isString.default)(permissionName)) {
      throw new TypeError('Parameter "permissionName" name must be String');
    }

    if (!(0, _isFunction.default)(validationFunction) && (0, _isArray.default)(validationFunction)) {
      throw new TypeError('Parameter "validationFunction" must be Function or an injectable Function using explicit annotation');
    }
  }

  return Permission;
}

var _default = PermPermission();

exports.default = _default;