"use strict";

require("core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _usePermission = _interopRequireDefault(require("./usePermission"));

var _isFunction = _interopRequireDefault(require("lodash/isFunction"));

var _propTypes = _interopRequireDefault(require("prop-types"));

const _excluded = ["sref", "only", "except", "onAuthorized", "onUnauthorized"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function HOCPermission(Component) {
  return function WrapperPermission(_) {
    const {
      sref,
      only,
      except,
      onAuthorized,
      onUnauthorized
    } = _,
          props = _objectWithoutProperties(_, _excluded);

    const authorized = (0, _usePermission.default)({
      sref,
      only,
      except
    });
    (0, _react.useEffect)(() => {
      if (authorized && (0, _isFunction.default)(onAuthorized)) onAuthorized();
      if (!authorized && (0, _isFunction.default)(onUnauthorized)) onUnauthorized();
    }, [authorized]);
    if (authorized) return /*#__PURE__*/_react.default.createElement(Component, props);else if ( /*#__PURE__*/(0, _react.isValidElement)(onUnauthorized)) return /*#__PURE__*/(0, _react.cloneElement)(onUnauthorized);else return null;
  };
}

HOCPermission.propTypes = {
  // Reference to other state name permissions (ui-router only)
  sref: _propTypes.default.string,
  // Single or multiple roles/permissions allowed to access content
  only: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array]),
  // Single or multiple roles/permissions denied to access content
  except: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array]),
  // Custom function invoked when authorized
  onAuthorized: _propTypes.default.func,
  // Custom function invoked when unauthorized
  onUnauthorized: _propTypes.default.oneOfType([_propTypes.default.element, _propTypes.default.func])
};
var _default = HOCPermission;
exports.default = _default;