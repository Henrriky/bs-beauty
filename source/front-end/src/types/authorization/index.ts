import { PERMISSIONS_MAP } from '../../constants/authorization'
import { ValueOf } from '../utils'

export type Permissions = ValueOf<
  (typeof PERMISSIONS_MAP)[keyof typeof PERMISSIONS_MAP]
>['permissionName']
