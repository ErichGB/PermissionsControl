import PermPermissionStore from '../store/permission'
import authService from '../../authService'
import permService from '../index'
// helpers
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import flattenDeep from 'lodash/flattenDeep'

const anonymous = permissionName =>
  new Promise((resolve, reject) =>
    authService
      .isAuthenticated()
      .then(() => reject(permissionName))
      .catch(() => resolve(permissionName))
  )

const hasPermissions = permissionName =>
  new Promise((resolve, reject) => {
    permService.getPermissions().then(perms => {
      if (isEmpty(perms.roles) && isEmpty(perms.views)) {
        reject(permissionName)
      } else {
        resolve(permissionName)
      }
    })
  })

// const isSuperUser = () => includes(permService.getRoles(), 'IMOX');

PermPermissionStore.definePermission('anonymous', anonymous)
PermPermissionStore.definePermission('hasPermissions', hasPermissions)

const setDefinitions = views => {
  const permissions = uniq(
    flattenDeep(
      map(views, ({ key, permission }) => map(permission, i => `${key}@${i}`))
    )
  )

  PermPermissionStore.defineManyPermissions(permissions, permission =>
    includes(permissions, permission)
  )
}

export default setDefinitions
