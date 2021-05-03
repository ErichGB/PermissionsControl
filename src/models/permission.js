import PermTransitionProperties from '../transitionProperties';
// helpers
// import invoke from 'lodash/invoke';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';

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
        let validationResult = this.validationFunction(this.permissionName, PermTransitionProperties);

        if (!isFunction(validationResult.then)) {
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
        if (!isString(permissionName)) {
            throw new TypeError('Parameter "permissionName" name must be String');
        }
        if (!isFunction(validationFunction) && isArray(validationFunction)) {
            throw new TypeError('Parameter "validationFunction" must be Function or an injectable Function using explicit annotation');
        }
    }

    return Permission;
}

export default PermPermission();