import { useEffect, useState } from 'react'
//
import PermPermissionMap from './authorization/map'
import PermAuthorization from './authorization'
import PermStateAuthorization from './authorization/state'
// helpers
import isString from 'lodash/isString'
import isUndefined from 'lodash/isUndefined'

export default function UsePermission({ sref, only, except }) {
  const [authorize, setAuthorize] = useState(false)

  useEffect(() => {
    if (isString(sref) && sref.length)
      PermStateAuthorization.authorizeByStateName(sref)
        .then(() => setAuthorize(true))
        .catch(() => setAuthorize(false))
  }, [sref])

  useEffect(() => {
    if (!isUndefined(only) || !isUndefined(except)) {
      const permissionMap = new PermPermissionMap({ only, except })
      PermAuthorization.authorizeByPermissionMap(permissionMap)
        .then(() => setAuthorize(true))
        .catch(() => setAuthorize(false))
    }
  }, [only, except])

  return authorize
}
