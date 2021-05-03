import PermRole from '../models/role';
// helpers
import forEach from 'lodash/forEach';
import isObject from 'lodash/isObject';
import isUndefined from 'lodash/isUndefined';
/**
 * Role definition storage
 * @name permission.PermRoleStore
 *
 * @param PermRole {permission.PermRole} Role definition constructor
 */
class PermRoleStore {
    constructor(){
        this.roleStore = {};
    }

    // let roleStore = {};

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
    defineRole = (roleName, validationFunction) => {
        this.roleStore[roleName] = new PermRole(roleName, validationFunction);
    };

    /**
     * Allows to define set of roleNames with shared validation function
     * @methodOf permission.PermPermissionStore
     * @throws {TypeError}
     *
     * @param roleMap {String, Function|Array<String>} Map of roles with matching validators
     */
    defineManyRoles = (roleMap) => {
        if (!isObject(roleMap)) {
            throw new TypeError('Parameter "roleNames" name must be object');
        }

        forEach(roleMap, (validationFunction, roleName) => {
            this.defineRole(roleName, validationFunction);
        });
    };

    /**
     * Deletes role from store
     * @method permission.PermRoleStore
     *
     * @param roleName {String} Name of defined permission
     */
    removeRoleDefinition = (roleName) => {
        delete this.roleStore[roleName];
    };

    /**
     * Checks if role is defined in store
     * @method permission.PermRoleStore
     *
     * @param roleName {String} Name of role
     * @returns {Boolean}
     */
    hasRoleDefinition = (roleName) => {
        return !isUndefined(this.roleStore[roleName]);
    };

    /**
     * Returns role definition object by it's name
     * @method permission.PermRoleStore
     *
     * @returns {permission.PermRole} PermRole definition object
     */
    getRoleDefinition = (roleName) => {
        return this.roleStore[roleName];
    };

    /**
     * Returns all role definitions
     * @method permission.PermRoleStore
     *
     * @returns {Object} Defined roles collection
     */
    getStore = () => {
        return this.roleStore;
    };

    /**
     * Removes all role definitions
     * @method permission.PermRoleStore
     */
    clearStore = () => {
        this.roleStore = {};
    };
}

export default new PermRoleStore();