import { useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { authAPI } from "../../../store/auth/auth-api"
import { userCanAccess } from "../../../utils/authorization/authorization.utils"
import { firstLetterOfWordToUpperCase } from "../../../utils/formatter/first-letter-of-word-to-upper-case.util"
import useAppSelector from "../../../hooks/use-app-selector"
import sideBarItems from "../consts"


export function useSideBar() {
  const user = useAppSelector((state) => state.auth.user!)
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  const { pathname: currentPagePathInfo } = useLocation()

  const selectUserInfo = authAPI.endpoints.fetchUserInfo.select()
  const userInfoQuery = useAppSelector(selectUserInfo)

  const displayName = userInfoQuery?.data?.user.name ?? user.name
  const safeDisplayName = (displayName ?? '') as string
  const currentUserDisplayName = safeDisplayName
    ? firstLetterOfWordToUpperCase(safeDisplayName)
    : ''
  const currentUserPhotoUrl =
    userInfoQuery?.data?.user.profilePhotoUrl ?? user.profilePhotoUrl

  const toggleSideBar = () => setIsSideBarOpen((v) => !v)
  const navigate = useNavigate()

  const items = useMemo(() => {
    return sideBarItems
      .filter((item) => {
        console.log('Evaluating sidebar item:', item.name)
        console.log('Item authorization requirements:', item.authorization)
        const userCanAccess2 = userCanAccess({ user, ...item.authorization })
        console.log(`User can access ${item.name}:`, userCanAccess2)
        return userCanAccess2
      })
      .reverse()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }, [])


  return {
    items,
    isSideBarOpen,
    currentUserPhotoUrl,
    currentPagePathInfo,
    currentUserDisplayName,
    navigate,
    toggleSideBar,
  }


}