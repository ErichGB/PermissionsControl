import React, { useEffect, isValidElement, cloneElement } from 'react'
// hooks
import usePermission from './usePermission'
// helpers
import isFunction from 'lodash/isFunction'
import PropTypes from 'prop-types'

function HOCPermission(Component) {
  return function WrapperPermission(_) {
    const { sref, only, except, onAuthorized, onUnauthorized, ...props } = _
    const authorized = usePermission({ sref, only, except })

    useEffect(() => {
      if (authorized && isFunction(onAuthorized)) onAuthorized()
      if (!authorized && isFunction(onUnauthorized)) onUnauthorized()
    }, [authorized])

    if (authorized) return <Component {...props} />
    else if (isValidElement(onUnauthorized)) return cloneElement(onUnauthorized)
    else return null
  }
}

HOCPermission.propTypes = {
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
}

export default HOCPermission
