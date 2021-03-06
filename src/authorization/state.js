import PermStatePermissionMap from '../authorization/stateMap';
import plugin  from '../ui-router';
// helpers
import isArray from 'lodash/isArray';

/**
 * Service responsible for handling inheritance-enabled state-based authorization in ui-router
 * @extends permission.PermPermissionMap
 * @name permission.ui.PermStateAuthorization
 *
 * @param $state {Object} State object
 * @param PermStatePermissionMap {permission.ui.PermStatePermissionMap|Function} Angular promise implementation
 */

function PermStateAuthorization() {

    this.authorizeByPermissionMap = authorizeByPermissionMap;
    this.authorizeByStateName = authorizeByStateName;

    /**
     * Handles authorization based on provided state permission map
     * @methodOf permission.ui.PermStateAuthorization
     *
     * @param statePermissionMap
     *
     * @return {promise}
     */
    function authorizeByPermissionMap(statePermissionMap) {
        return authorizeStatePermissionMap(statePermissionMap);
    }

    /**
     * Authorizes uses by provided state name
     * @methodOf permission.ui.PermStateAuthorization
     *
     * @param stateName {String}
     * @returns {promise}
     */
    function authorizeByStateName(stateName) {
        const srefState = plugin.prototype.stateService.get(stateName);
        const permissionMap = new PermStatePermissionMap(srefState);
        return authorizeByPermissionMap(permissionMap);
    }

    /**
     * Checks authorization for complex state inheritance
     * @methodOf permission.ui.PermStateAuthorization
     * @private
     *
     * @param map {permission.ui.StatePermissionMap} State access rights map
     *
     * @returns {Promise<any>} Promise object
     */
    function authorizeStatePermissionMap(map) {
        return new Promise((resolve, reject) => {
            const deferred = {resolve, reject};
            resolveExceptStatePermissionMap(deferred, map);
        });
    }

    /**
     * Resolves compensated set of "except" privileges
     * @methodOf permission.ui.PermStateAuthorization
     * @private
     *
     * @param deferred {Object} Promise defer
     * @param map {permission.ui.StatePermissionMap} State access rights map
     */
    function resolveExceptStatePermissionMap(deferred, map) {
        const exceptPromises = resolveStatePermissionMap(map.except, map);
        // Reverse the promises, so if any "except" privileges are not met, the promise rejects
        // console.log('exceptPromises', exceptPromises);
        Promise.all(reversePromises(exceptPromises))
            .then(() => resolveOnlyStatePermissionMap(deferred, map))
            .catch((rejectedPermissions) => {

                if (!isArray(rejectedPermissions)) {
                    rejectedPermissions = [rejectedPermissions];
                }

                deferred.reject(rejectedPermissions[0]);
            });
    }

    /**
     * Resolves compensated set of "only" privileges
     * @methodOf permission.ui.PermStateAuthorization
     * @private
     *
     * @param deferred {Object} Promise defer
     * @param map {permission.ui.StatePermissionMap} State access rights map
     */
    function resolveOnlyStatePermissionMap(deferred, map) {
        if (!map.only.length) {
            deferred.resolve();
            return;
        }

        const onlyPromises = resolveStatePermissionMap(map.only, map);

        Promise.all(onlyPromises)
            .then( (resolvedPermissions) => {
                deferred.resolve(resolvedPermissions);
            })
            .catch((rejectedPermission) => {
                deferred.reject(rejectedPermission);
            });
    }

    /**
     * Performs iteration over list of privileges looking for matches
     * @methodOf permission.ui.PermStateAuthorization
     * @private
     *
     * @param privilegesNames {Array} Array of sets of access rights
     * @param map {permission.ui.StatePermissionMap} State access rights map
     *
     * @returns {Array<Promise>} Promise collection
     */
    function resolveStatePermissionMap(privilegesNames, map) {

        if (!privilegesNames.length) {
            return [Promise.reject()];
        }

        return privilegesNames.map( (statePrivileges) => {
            const resolvedStatePrivileges = map.resolvePropertyValidity(statePrivileges);

            return Promise.any(resolvedStatePrivileges)
                .then(function (resolvedPermissions) {
                    if (isArray(resolvedPermissions)) {
                        return resolvedPermissions[0];
                    }
                    return resolvedPermissions;
                });
        });
    }

    /**
     * Creates an Array of Promises that resolve when rejected, and reject when resolved
     * @methodOf permission.ui.PermStateAuthorization
     * @private
     *
     * @param promises {Array} Array of promises
     *
     * @returns {Array<Promise>} Promise collection
     */
    function reversePromises (promises) {
        return promises.map( (promise) =>
            new Promise ((resolve, reject) =>
                promise.then(reject, resolve)
            )
        );
    }
}

export default new PermStateAuthorization();
