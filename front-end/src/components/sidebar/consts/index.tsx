import {
  ArrowLeftStartOnRectangleIcon,
  BriefcaseIcon,
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
  order?: number
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
      name: 'Sair',
      icon: <ArrowLeftStartOnRectangleIcon className="size-6" />,
      navigateTo: '/',
      order: 99,
    },
    {
      name: 'Perfil',
      icon: <UserIcon className="size-6" />,
      navigateTo: '/profile',
      order: 98,
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
      order: 1,
    },
  ],
  [Role.MANAGER]: [
    {
      name: 'Clientes',
      icon: <UsersIcon className="size-6" />,
      navigateTo: '/customers',
    },
    {
      name: 'Funcionários',
      icon: <ClipboardDocumentCheckIcon className="size-6" />,
      navigateTo: '/employees-management',
    },
    {
      name: 'Serviços',
      icon: <BriefcaseIcon className="size-6" />,
      navigateTo: '/management/services',
    },
    {
      name: 'Turnos',
      icon: <ClockIcon className="size-6" />,
      navigateTo: '/employee-shifts',
    },
    {
      name: 'Home',
      icon: <HomeIcon className="size-6" />,
      navigateTo: '/manager/home',
    },
  ],
  [Role.EMPLOYEE]: [
    {
      name: 'Serviços',
      icon: <BriefcaseIcon className="size-6" />,
      navigateTo: '/management/services',
    },
    {
      name: 'Turnos',
      icon: <ClockIcon className="size-6" />,
      navigateTo: '/employee-shifts',
    },
    {
      name: 'Home',
      icon: <HomeIcon className="size-6" />,
      navigateTo: '/employee/home',
    },
  ],
}

export default sideBarItems
