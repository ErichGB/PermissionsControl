"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _role = _interopRequireDefault(require("../models/role"));

var _forEach = _interopRequireDefault(require("lodash/forEach"));

var _isObject = _interopRequireDefault(require("lodash/isObject"));

var _isUndefined = _interopRequireDefault(require("lodash/isUndefined"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Role definition storage
 * @name permission.PermRoleStore
 *
 * @param PermRole {permission.PermRole} Role definition constructor
 */
class PermRoleStore {
  constructor() {
    _defineProperty(this, "defineRole", (roleName, validationFunction) => {
      this.roleStore[roleName] = new _role.default(roleName, validationFunction);
    });

    _defineProperty(this, "defineManyRoles", roleMap => {
      if (!(0, _isObject.default)(roleMap)) {
        throw new TypeError('Parameter "roleNames" name must be object');
      }

      (0, _forEach.default)(roleMap, (validationFunction, roleName) => {
        this.defineRole(roleName, validationFunction);
      });
    });

    _defineProperty(this, "removeRoleDefinition", roleName => {
      delete this.roleStore[roleName];
    });

    _defineProperty(this, "hasRoleDefinition", roleName => {
      return !(0, _isUndefined.default)(this.roleStore[roleName]);
    });

    _defineProperty(this, "getRoleDefinition", roleName => {
      return this.roleStore[roleName];
    });

    _defineProperty(this, "getStore", () => {
      return this.roleStore;
    });

    _defineProperty(this, "clearStore", () => {
      this.roleStore = {};
    });

    this.roleStore = {};
  } // let roleStore = {};
  // this.defineRole = defineRole;
  // this.defineManyRoles = defineManyRoles;
  // this.getRoleDefinition = getRoleDefinition;
  // this.hasRoleDefinition = hasRoleDefinition;
  // this.removeRoleDefinition = removeRoleDefinition;
  // this.getStore = getStore;
  // this.clearStore = clearStore;

  /**
   * Allows to add single role definition to the store by providing it's name and validation function
   * @methodOf permission.PermRoleStore
   *
   * @param roleName {String} Name of defined role
   * @param [validationFunction] {Function|Array<String>} Function used to validate if role is valid or set of
   *   permission names that has to be owned to have a role
   */


}

var _default = new PermRoleStore();

exports.default = _default;