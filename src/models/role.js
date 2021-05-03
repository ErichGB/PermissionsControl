import PermPermissionStore from '../store/permission';
import PermTransitionProperties from '../transitionProperties';
// helpers
import invoke from 'lodash/invoke';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';

/**
 * Role definition factory
 * @function
 *
 * @param PermPermissionStore {permission.PermPermissionStore} Permission definition storage
 * @param PermTransitionProperties {permission.PermTransitionProperties} Helper storing ui-router transition parameters
 *
 * @return {Role}
 */
const PermRole = () => {

    /**
     * Role definition constructor
     * @constructor Role
     *
     * @param roleName {String} Name representing role
     * @param validationFunction {Function|Array<String>} Optional function used to validate if permissions are still
     *   valid or list of permission names representing role
     */
    function Role(roleName, validationFunction) {
        validateConstructor(roleName, validationFunction);

        this.roleName = roleName;
        this.validationFunction = annotateValidationFunction(validationFunction);
    }

    /**
     * Checks if role is still valid
     * @methodOf permission.Role
     *
     * @returns {Promise} $q.promise object
     */
    Role.prototype.validateRole = function () {
        const validationLocals = {
            roleName: this.roleName,
            transitionProperties: PermTransitionProperties
        };
        let validationResult = invoke(this.validationFunction, null, validationLocals);

        if (!isFunction(validationResult.then)) {
            validationResult = wrapInPromise(validationResult, this.roleName);
        }

        return validationResult;
    };

    /**
     * Converts a value into a promise, if the value is truthy it resolves it, otherwise it rejects it
     * @methodOf permission.Role
     * @private
     *
     * @param result {Boolean} Function to be wrapped into promise
     * @param [roleName] {String} Returned value in promise
     *
     * @return {Promise}
     */
    function wrapInPromise(result, roleName) {
        if (result) {
            return Promise.resolve(roleName);
        }

        return Promise.reject(roleName);
    }

    /**
     * Checks if provided permission has accepted parameter types
     * @methodOf permission.Role
     * @private
     *
     * @throws {TypeError}
     *
     * @param roleName {String} Name representing role
     * @param validationFunction {Function|Array<String>} Optional function used to validate if permissions are still
     *   valid or list of permission names representing role
     */
    function validateConstructor(roleName, validationFunction) {
        if (!isString(roleName)) {
            throw new TypeError('Parameter "roleName" name must be String');
        }

        if (!isArray(validationFunction) && isFunction(validationFunction)) {
            throw new TypeError('Parameter "validationFunction" must be array or function');
        }
    }


    /**
     * Ensures the validation is injectable using explicit annotation.
     * Wraps a non-injectable function for backwards compatibility
     * @methodOf permission.Role
     * @private
     *
     * @param validationFunction {Function|Array} Function to wrap with injectable if needed
     *
     * @return {Function} Explicitly injectable function
     */
    function annotateValidationFunction(validationFunction) {
        // Test if the validation function is just an array of permission names
        if (isArray(validationFunction) && !isFunction(validationFunction[validationFunction.length - 1])) {
            validationFunction = preparePermissionEvaluation(validationFunction);
        } else if (!isArray(validationFunction.$inject || validationFunction)) {
            // The function is not explicitly annotated, so assume using old-style parameters
            // and manually prepare for injection using our known old API parameters
            validationFunction = ['roleName', 'transitionProperties', validationFunction];
        }

        return validationFunction;
    }

    /**
     * Creates an injectable function that evaluates a set of permissions in place of a role validation function
     * @methodOf permission.Role
     * @private
     *
     * @param permissions {Array<String>} List of permissions to evaluate
     *
     * @return {Function}
     */
    function preparePermissionEvaluation(permissions) {
        return function () {
            const promises = permissions.map(function (permissionName) {
                if (PermPermissionStore.hasPermissionDefinition(permissionName)) {
                    let permission = PermPermissionStore.getPermissionDefinition(permissionName);

                    return permission.validatePermission();
                }

                return Promise.reject(permissionName);
            });

            return Promise.all(promises);
        };
    }

    return Role;
};

export default PermRole();