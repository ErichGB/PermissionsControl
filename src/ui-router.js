import PermTransitionProperties from './transitionProperties';
import PermStatePermissionMap from './authorization/stateMap';
import PermStateAuthorization from './authorization/state';
// helpers
import isEqual from 'lodash/isEqual';

/**
 * @namespace permission.ui
 */

/**
 * @param $stateProvider {Object}
 */

/**
 * @param $injector {Object}
 * @param $rootScope {Object}
 * @param $state {Object}
 * @param PermTransitionProperties {permission.PermTransitionProperties}
 * @param PermStateAuthorization {permission.ui.PermStateAuthorization}
 * @param PermStatePermissionMap {permission.ui.PermStatePermissionMap}
 */

class permissionUI {
    constructor(router, options) {
        this.name = "ui-router-permission-plugin";

        const $transitions = router.transitionService;

        /**
         * State transition web hook
         * @param transition {Object}
         */
        function handleOnBeforeWebHook(transition) {
            setTransitionProperties(transition);

            const toState = transition.to();
            const statePermissionMap = new PermStatePermissionMap(toState);

            return PermStateAuthorization
                    .authorizeByPermissionMap(statePermissionMap)
                    .catch((rejectedPermission) =>
                        statePermissionMap
                            .resolveRedirectState(rejectedPermission)
                            .then((redirect) => {
                                if(isEqual(toState.name, redirect.state) && isEqual(transition._targetState._params, redirect.params)) return true;
                                return transition.router.stateService.target(redirect.state, redirect.params, redirect.options)
                            })
                        );

            /**
             * Updates values of `PermTransitionProperties` holder object
             * @method
             * @private
             */
            function setTransitionProperties(transition) {
                PermTransitionProperties.toState = transition.to();
                PermTransitionProperties.toParams = transition.params('to');
                PermTransitionProperties.fromState = transition.from();
                PermTransitionProperties.fromParams = transition.params('from');
                PermTransitionProperties.options = transition.options();
            }
        }

        $transitions.onBefore({}, handleOnBeforeWebHook);

        permissionUI.prototype.stateService = router.stateService;
    }
}

export default permissionUI;