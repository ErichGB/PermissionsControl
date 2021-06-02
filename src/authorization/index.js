/**
 * Service responsible for handling view based authorization
 * @name permission.PermAuthorization
 *
 */
class PermAuthorization{

    /**
     * Handles authorization based on provided permissions map
     * @methodOf permission.PermAuthorization
     *
     * @param map {permission.PermissionMap} Map of permission names
     *
     * @returns {promise} $q.promise object
     */
    authorizeByPermissionMap = (map) =>
        new Promise( (resolve, reject) => {
            const deferred = {resolve, reject};
            this.resolveExceptPrivilegeMap(deferred, map);
        });

    /**
     * Resolves flat set of "except" privileges
     * @methodOf permission.PermAuthorization
     * @private
     *
     * @param deferred {Object} Promise defer
     * @param map {permission.PermissionMap} Access rights map
     *
     */
    resolveExceptPrivilegeMap = (deferred, map) => {
        const exceptPromises = map.resolvePropertyValidity(map.except);

        new Promise.any(exceptPromises)
            .then( (rejectedPermissions) => {
                deferred.reject(rejectedPermissions);
            })
            .catch(() => {
                this.resolveOnlyPermissionMap(deferred, map);
            });
    };

    /**
     * Resolves flat set of "only" privileges
     * @methodOf permission.PermAuthorization
     * @private
     *
     * @param deferred {Object} Promise defer
     * @param map {permission.PermissionMap} Access rights map
     */
    resolveOnlyPermissionMap = (deferred, map) => {

        if (!map.only.length) {
            deferred.resolve();
            return;
        }

        const onlyPromises = map.resolvePropertyValidity(map.only);

        $q.any(onlyPromises)
            .then((resolvedPermissions) =>
                deferred.resolve(resolvedPermissions))
            .catch((rejectedPermission) =>
                deferred.reject(rejectedPermission));
    }
}

export default new PermAuthorization();
