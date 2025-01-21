import {
  BellIcon,
  CalendarDaysIcon,
  HomeIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import React from 'react'
import { Role } from '../../../store/auth/types'

type SideBarItem = {
  name: string
  navigateTo: string
  icon: React.ReactNode
}

type SideBarOptions = {
  COMMON: SideBarItem[]
  [Role.MANAGER]: SideBarItem[]
  [Role.EMPLOYEE]: SideBarItem[]
  [Role.CUSTOMER]: SideBarItem[]
}

const sideBarItems: SideBarOptions = {
  COMMON: [
    {
      name: 'Perfil',
      icon: <UserIcon className="size-6" />,
      navigateTo: '/profile',
    },
  ],
  [Role.CUSTOMER]: [
    {
      name: 'Agendamentos',
      icon: <CalendarDaysIcon className="size-6" />,
      navigateTo: '/appointments',
    },
    {
      name: 'Home',
      icon: <HomeIcon className="size-6" />,
      navigateTo: '/customer/home',
    },
  ],
  [Role.MANAGER]: [
    {
      name: 'Notificações',
      icon: <BellIcon className="size-6" />,
      navigateTo: '/notifications',
    },
    {
      name: 'Clientes',
      icon: <UsersIcon className="size-6" />,
      navigateTo: '/customers',
    },
    {
      name: 'Home',
      icon: <HomeIcon className="size-6" />,
      navigateTo: '/manager/home',
    },
  ],
  [Role.EMPLOYEE]: [
    {
      name: 'Home',
      icon: <HomeIcon className="size-6" />,
      navigateTo: '/customer/home',
    },
  ],
}

export default sideBarItems
