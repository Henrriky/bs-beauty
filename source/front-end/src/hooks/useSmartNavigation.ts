import { useLocation, useNavigate } from 'react-router'
import { useCallback, useMemo } from 'react'
import { authAPI } from '../store/auth/auth-api'
import { UserType } from '../store/auth/types'

interface NavigationRule {
  pattern: RegExp
  backTo: string | ((matches: RegExpMatchArray) => string)
  label?: string
}

export function useSmartNavigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: userData } = authAPI.useFetchUserInfoQuery()
  const userType = userData?.user?.userType

  const getHomeRoute = useCallback((): string => {
    switch (userType) {
      case UserType.CUSTOMER:
        return '/customer/home'
      case UserType.PROFESSIONAL:
        return '/professional/home'
      case UserType.MANAGER:
        return '/manager/home'
      default:
        return '/'
    }
  }, [userType])

  const navigationRules: NavigationRule[] = useMemo(
    () => [
      // Payment Records - Detail to List
      {
        pattern: /^\/payments\/([^/]+)$/,
        backTo: '/payments',
        label: 'Voltar para Registros de Pagamento',
      },
      // Payment Records - List to Home
      {
        pattern: /^\/payments$/,
        backTo: getHomeRoute(),
        label: 'Voltar para Início',
      },
      // Appointments - Detail to List
      {
        pattern: /^\/appointments\/([^/]+)$/,
        backTo: '/appointments',
        label: 'Voltar para Agendamentos',
      },
      // Appointments - List to Home
      {
        pattern: /^\/appointments$/,
        backTo: getHomeRoute(),
        label: 'Voltar para Início',
      },
      // Customers - List to Home
      {
        pattern: /^\/manager\/customers$/,
        backTo: getHomeRoute(),
        label: 'Voltar para Início',
      },
      // Professionals - List to Home
      {
        pattern: /^\/manager\/professionals$/,
        backTo: getHomeRoute(),
        label: 'Voltar para Início',
      },
      // Services - Dashboard to Home
      {
        pattern: /^\/services$/,
        backTo: getHomeRoute(),
        label: 'Voltar para Início',
      },
      // Shifts - List to Home
      {
        pattern: /^\/shifts$/,
        backTo: getHomeRoute(),
        label: 'Voltar para Início',
      },
      // Blocked Times - List to Home
      {
        pattern: /^\/blocked-times$/,
        backTo: getHomeRoute(),
        label: 'Voltar para Início',
      },
      // Analytics Reports - Dashboard to Home
      {
        pattern: /^\/analytics\/reports$/,
        backTo: getHomeRoute(),
        label: 'Voltar para Início',
      },
      // Roles - List to Home
      {
        pattern: /^\/manager\/roles$/,
        backTo: getHomeRoute(),
        label: 'Voltar para Início',
      },
      // Notification Templates - List to Home
      {
        pattern: /^\/manager\/notification-templates$/,
        backTo: getHomeRoute(),
        label: 'Voltar para Início',
      },
      // Notifications - List to Home
      {
        pattern: /^\/notifications$/,
        backTo: getHomeRoute(),
        label: 'Voltar para Início',
      },
      // Profile - to Home
      {
        pattern: /^\/profile$/,
        backTo: getHomeRoute(),
        label: 'Voltar para Início',
      },
    ],
    [getHomeRoute],
  )

  const isHomePage = useCallback((): boolean => {
    const homeRoutes = ['/customer/home', '/professional/home', '/manager/home']
    return homeRoutes.includes(location.pathname)
  }, [location.pathname])

  const getNavigationInfo = useCallback((): {
    backTo: string
    label: string
  } | null => {
    if (isHomePage()) {
      return null
    }

    for (const rule of navigationRules) {
      const matches = location.pathname.match(rule.pattern)
      if (matches) {
        const backTo =
          typeof rule.backTo === 'function' ? rule.backTo(matches) : rule.backTo
        return {
          backTo,
          label: rule.label || 'Voltar',
        }
      }
    }

    return {
      backTo: getHomeRoute(),
      label: 'Voltar para Início',
    }
  }, [location.pathname, navigationRules, isHomePage, getHomeRoute])

  const goBack = useCallback(() => {
    const navInfo = getNavigationInfo()
    if (navInfo) {
      navigate(navInfo.backTo)
    }
  }, [getNavigationInfo, navigate])

  return {
    isHomePage: isHomePage(),
    navigationInfo: getNavigationInfo(),
    goBack,
  }
}
