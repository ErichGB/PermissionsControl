import PermPermission from '../models/permission';
import permissionStore from '../store/permission';
// helpers
import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';
import isUndefined from 'lodash/isUndefined';
/**
 * Permission definition storage
 * @name permission.PermPermissionStore
 *
 * @param PermPermission {permission.PermPermission|Function}
 */
class PermPermissionStore {
    constructor(){
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
    definePermission = (permissionName, validationFunction) => {
        this.permissionStore[permissionName] = new PermPermission(permissionName, validationFunction);
    };

    /**
     * Allows to define set of permissionNames with shared validation function on application configuration
     * @methodOf permission.PermPermissionStore
     * @throws {TypeError}
     *
     * @param permissionNames {Array<Number>} Set of permission names
     * @param validationFunction {Function} Function used to validate if permission is valid
     */
    defineManyPermissions = (permissionNames, validationFunction) => {
        // console.log('defineManyPermissions', validationFunction);
        if (!isArray(permissionNames)) {
            throw new TypeError('Parameter "permissionNames" name must be Array');
        }
        // console.log(permissionNames);
        forEach(permissionNames, (permissionName) => {
            this.definePermission(permissionName, validationFunction);
        });
    };

    /**
     * Deletes permission
     * @methodOf permission.PermPermissionStore
     *
     * @param permissionName {String} Name of defined permission
     */
    removePermissionDefinition = (permissionName) => {
        delete permissionStore[permissionName];
    };

    /**
     * Checks if permission exists
     * @methodOf permission.PermPermissionStore
     *
     * @param permissionName {String} Name of defined permission
     * @returns {Boolean}
     */
    hasPermissionDefinition = (permissionName) => {
        return !isUndefined(this.permissionStore[permissionName]);
    };

    /**
     * Returns permission by it's name
     * @methodOf permission.PermPermissionStore
     *
     * @returns {permission.Permission} Permissions definition object
     */
    getPermissionDefinition = (permissionName) => {
        return this.permissionStore[permissionName];
    };

    /**
     * Returns all permissions
     * @methodOf permission.PermPermissionStore
     *
     * @returns {Object} Permissions collection
     */
    getStore = () => {
        return this.permissionStore;
    };

    /**
     * Removes all permissions
     * @methodOf permission.PermPermissionStore
     */
    clearStore = () => {
        this.permissionStore = {};
    }
}

export default new PermPermissionStore();