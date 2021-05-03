import React from 'react';
import PropTypes from 'prop-types';
import PermAuthorization from '../authorization';
import PermPermissionMap from '../authorization/map';
import PermStateAuthorization from '../authorization/state';
// helpers
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';

class Permission extends React.Component {
    static propTypes = {
        // Reference to other state name permissions (ui-router only)
        sref: PropTypes.string,
        // Single or multiple roles/permissions allowed to access content
        only: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ]),
        // Single or multiple roles/permissions denied to access content
        except:  PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ]),
        // Custom function invoked when authorized
        onAuthorized: PropTypes.func,
        // Custom function invoked when unauthorized
        onUnauthorized:  PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.func
        ])
    };

    constructor(props) {
        super(props);
        this.permissionGroup = ['only', 'except', 'sref'];
        this.state = { render: null }
    }

    UNSAFE_componentWillMount() {
        const permission = pick(this.props, this.permissionGroup);
        this.checkAuthorization(permission);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const previousPermission = pick(this.props, this.permissionGroup);
        const newPermission = pick(nextProps, this.permissionGroup);

        if(!isEqual(previousPermission, newPermission))
            this.checkAuthorization(newPermission);
    }

    checkAuthorization = (permission) => {
        try {
            if (this.isSrefStateDefined(permission)) {
                PermStateAuthorization
                    .authorizeByStateName(permission.sref)
                    .then(this.onAuthorizedAccess)
                    .catch(this.onUnauthorizedAccess);

            } else {
                const permissionMap = new PermPermissionMap({only: permission.only, except: permission.except});

                PermAuthorization
                    .authorizeByPermissionMap(permissionMap)
                    .then(() => this.onAuthorizedAccess())
                    .catch(() => this.onUnauthorizedAccess());
            }
        } catch (e) {
            this.onUnauthorizedAccess();
        }
    };

    /**
     * Returns true when permissions should be checked based on state name
     * @private
     * $injector.has('$state') && permission.sref;
     * @returns {boolean}
     */
    isSrefStateDefined = (permission) =>
        permission.sref;

    /**
     * Calls `onAuthorized` function if provided or show element
     * @private
     */
    onAuthorizedAccess = () => {
        if (isFunction(this.props.onAuthorized)) {
            this.props.onAuthorized();
        } else {
            this.setState({render: React.cloneElement(this.props.children)});

            // var onAuthorizedMethodName = $permission.defaultOnAuthorizedMethod;
            // PermPermissionStrategies[onAuthorizedMethodName]($element);
        }
    };

    /**
     * Calls `onUnauthorized` function if provided or hide element
     * @private
     */
    onUnauthorizedAccess = () => {
        if (isFunction(this.props.onUnauthorized)) {
            this.props.onUnauthorized();
        } else {

            if(React.isValidElement(this.props.onUnauthorized)){
                this.setState({render: React.cloneElement(this.props.onUnauthorized)});
            }else{
                this.setState({render: null});
            }

            // var onUnauthorizedMethodName = $permission.defaultOnUnauthorizedMethod;
            // PermPermissionStrategies[onUnauthorizedMethodName]($element);
        }
    };

    render() {
        return this.state.render;
    }
}

export default Permission;