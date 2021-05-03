import PermRoleStore from '../store/role';
import PermPermissionStore from '../store/permission';
import PermTransitionProperties from '../transitionProperties';
// helpers
import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';

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
        if (isUndefined(this.redirectTo)) {
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
            if (PermRoleStore.hasRoleDefinition(privilegeName)) {
                const role = PermRoleStore.getRoleDefinition(privilegeName);
                return role.validateRole();
            }

            if (PermPermissionStore.hasPermissionDefinition(privilegeName)) {
                const permission = PermPermissionStore.getPermissionDefinition(privilegeName);
                return permission.validatePermission();
            }

            // if (!$permission.suppressUndefinedPermissionWarning) {
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
        return Promise
            .resolve(redirectFunction(rejectedPermissionName, PermTransitionProperties))
            .then( (redirectState) => {
                if (isString(redirectState)) {
                    return {
                        state: redirectState
                    };
                }

                if (isObject(redirectState)) {
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
        if (isString(property)) {
            return [property];
        }

        if (isArray(property)) {
            return property;
        }

        if (isFunction(property)) {
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
        if (isUndefined(redirectTo)) {
            return;
        }

        if (isFunction(redirectTo)) {
            return normalizeFunctionRedirectionRule(redirectTo);
        }

        if (isObject(redirectTo)) {

            if (isObjectSingleRedirectionRule(redirectTo)) {
                return normalizeObjectSingleRedirectionRule(redirectTo);
            }

            return normalizeObjectMultipleRedirectionRule(redirectTo);
        }

        if (isString(redirectTo)) {
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

        redirectionMap.default = () => ({state: redirectTo});

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
        return !isUndefined(redirectTo.state);
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

        forEach(redirectTo, (redirection, permission) => {

            if (isFunction(redirection)) {
                redirectionMap[permission] = redirection;
            }

            if (isObject(redirection)) {
                redirectionMap[permission] = () => redirection;
            }

            if (isString(redirection)) {
                redirectionMap[permission] = () => ({ state: redirection });
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

        redirectionMap.default = redirectTo;

        // if (isUndefined(redirectTo)) {
        //     redirectionMap.default = rejectedPermission;
        // }

        return redirectionMap;
    }

    return PermissionMap;
};

export default PermPermissionMap();
