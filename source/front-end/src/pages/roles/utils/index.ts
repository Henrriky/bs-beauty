import { permissionDisplayMap } from '../../../constants/authorization'

export const getPermissionTranslationByCompositeKey = (
  compositeKey: string,
) => {
  return (
    permissionDisplayMap[compositeKey] || {
      resource: compositeKey,
      action: '',
    }
  )
}
