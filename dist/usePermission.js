"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = UsePermission;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = require("react");

var _map = _interopRequireDefault(require("./authorization/map"));

var _authorization = _interopRequireDefault(require("./authorization"));

var _state = _interopRequireDefault(require("./authorization/state"));

var _isString = _interopRequireDefault(require("lodash/isString"));

var _isUndefined = _interopRequireDefault(require("lodash/isUndefined"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
// helpers
function UsePermission(_ref) {
  let {
    sref,
    only,
    except
  } = _ref;
  const [authorize, setAuthorize] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    if ((0, _isString.default)(sref) && sref.length) _state.default.authorizeByStateName(sref).then(() => setAuthorize(true)).catch(() => setAuthorize(false));
  }, [sref]);
  (0, _react.useEffect)(() => {
    if (!(0, _isUndefined.default)(only) || !(0, _isUndefined.default)(except)) {
      const permissionMap = new _map.default({
        only,
        except
      });

      _authorization.default.authorizeByPermissionMap(permissionMap).then(() => setAuthorize(true)).catch(() => setAuthorize(false));
    }
  }, [only, except]);
  return authorize;
}