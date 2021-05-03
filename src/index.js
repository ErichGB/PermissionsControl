// import storeRoles from './definitions/roles';
import storePermissions from './definitions/permissions'
// actions
import { fetchPermissions, setRole } from '../actions/Global/permission'
// helpers
import get from 'lodash/get'
import map from 'lodash/map'
import isUndefined from 'lodash/isUndefined'

const permissionService = () => {
  let redux = undefined
  let roles = undefined
  let views = undefined

  const initialize = store => (redux = store)

  const getPermissions = () => {
    return new Promise((resolve, reject) => {
      if (isUndefined(roles) || isUndefined(views)) {
        fetchAndSetPermissions().then(info => {
          resolve(info)
        })
      } else {
        resolve({ roles, views })
      }
    })
  }

  const fetchAndSetPermissions = () => {
    const query = '{ getPermissionUserEcfone { key permission } }'

    return fetchPermissions(query).then(data => {
      views = get(data, 'data.getPermissionUserEcfone', [])
      storePermissions(views)

      return { views }
    })
  }

  const getStates = () => map(views, 'acceso')

  const getRoles = () => roles

  const getViews = () => views

  return { initialize, getPermissions, getStates, getRoles, getViews }
}

export default permissionService()
