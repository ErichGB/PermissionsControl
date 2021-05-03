import React, { useEffect, isValidElement, cloneElement } from 'react'
// hooks
import usePermission from './usePermission'
// helpers
import isFunction from 'lodash/isFunction'

export default function HOCPermission(Component) {
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
