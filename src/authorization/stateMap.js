import PermPermissionMap from '../authorization/map';
// helpers
import extend from 'lodash/extend';
import forEach from 'lodash/forEach';
import isUndefined from 'lodash/isUndefined';
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

    StatePermissionMap.prototype = new PermPermissionMap();

    /**
     * Constructs map instructing authorization service how to handle authorizing
     * @constructor permission.ui.PermStatePermissionMap
     * @extends permission.PermPermissionMap
     */
    function StatePermissionMap(state) {
        const toStateObject = state.$$state();
        const toStatePath = toStateObject.path;

        forEach(toStatePath, (state) => {
            if (areSetStatePermissions(state)) {
                const permissionMap = new PermPermissionMap(state.data.permissions);
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

        if (!isUndefined(permissionMap.redirectTo)) {
            this.redirectTo = extend({}, this.redirectTo, permissionMap.redirectTo);
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

export default PermStatePermissionMap();