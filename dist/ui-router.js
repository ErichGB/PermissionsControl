"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _transitionProperties = _interopRequireDefault(require("./transitionProperties"));

var _stateMap = _interopRequireDefault(require("./authorization/stateMap"));

var _state = _interopRequireDefault(require("./authorization/state"));

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// helpers

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
      const statePermissionMap = new _stateMap.default(toState);
      return _state.default.authorizeByPermissionMap(statePermissionMap).catch(rejectedPermission => statePermissionMap.resolveRedirectState(rejectedPermission).then(redirect => {
        if ((0, _isEqual.default)(toState.name, redirect.state) && (0, _isEqual.default)(transition._targetState._params, redirect.params)) return true;
        return transition.router.stateService.target(redirect.state, redirect.params, redirect.options);
      }));
      /**
       * Updates values of `PermTransitionProperties` holder object
       * @method
       * @private
       */

      function setTransitionProperties(transition) {
        _transitionProperties.default.toState = transition.to();
        _transitionProperties.default.toParams = transition.params('to');
        _transitionProperties.default.fromState = transition.from();
        _transitionProperties.default.fromParams = transition.params('from');
        _transitionProperties.default.options = transition.options();
      }
    }

    $transitions.onBefore({}, handleOnBeforeWebHook);
    permissionUI.prototype.stateService = router.stateService;
  }

}

exports.default = permissionUI;