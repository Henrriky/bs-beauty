import {
  BellIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
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
      name: 'Home',
      icon: <HomeIcon className="size-6" />,
      navigateTo: '/customer/home',
    },
    {
      name: 'Agendamentos',
      icon: <CalendarDaysIcon className="size-6" />,
      navigateTo: '/appointments',
    },
  ],
  [Role.MANAGER]: [
    {
      name: 'Home',
      icon: <HomeIcon className="size-6" />,
      navigateTo: '/manager/home',
    },
    {
      name: 'Clientes',
      icon: <UsersIcon className="size-6" />,
      navigateTo: '/customers',
    },
    {
      name: 'Notificações',
      icon: <BellIcon className="size-6" />,
      navigateTo: '/notifications',
    },
    {
      name: 'Funcionários',
      icon: <ClipboardDocumentCheckIcon className="size-6" />,
      navigateTo: '/employees-management',
    },
    {
      name: 'Turnos',
      icon: <ClockIcon className="size-6" />,
      navigateTo: '/employee-shifts',
    },
  ],
  [Role.EMPLOYEE]: [
    {
      name: 'Home',
      icon: <HomeIcon className="size-6" />,
      navigateTo: '/customer/home',
    },
    {
      name: 'Turnos',
      icon: <ClockIcon className="size-6" />,
      navigateTo: '/employee-shifts',
    },
  ],
}

export default sideBarItems
