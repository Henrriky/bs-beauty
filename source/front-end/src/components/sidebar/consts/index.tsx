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
import { UserType } from '../../../store/auth/types'

type SideBarItem = {
  name: string
  navigateTo: string
  icon: React.ReactNode
  order?: number
}

type SideBarOptions = {
  COMMON: SideBarItem[]
  [UserType.MANAGER]: SideBarItem[]
  [UserType.PROFESSIONAL]: SideBarItem[]
  [UserType.CUSTOMER]: SideBarItem[]
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
    {
      name: 'Agendamentos',
      icon: <CalendarDaysIcon className="size-6" />,
      navigateTo: '/appointments',
    },
  ],
  [UserType.CUSTOMER]: [
    {
      name: 'Home',
      icon: <HomeIcon className="size-6" />,
      navigateTo: '/customer/home',
      order: 1,
    },
  ],
  [UserType.MANAGER]: [
    {
      name: 'Clientes',
      icon: <UsersIcon className="size-6" />,
      navigateTo: '/customers',
    },
    {
      name: 'Profissionais',
      icon: <ClipboardDocumentCheckIcon className="size-6" />,
      navigateTo: '/professionals-management',
    },
    {
      name: 'Serviços',
      icon: <BriefcaseIcon className="size-6" />,
      navigateTo: '/management/services',
    },
    {
      name: 'Turnos',
      icon: <ClockIcon className="size-6" />,
      navigateTo: '/professional-shifts',
    },
    {
      name: 'Home',
      icon: <HomeIcon className="size-6" />,
      navigateTo: '/manager/home',
    },
  ],
  [UserType.PROFESSIONAL]: [
    {
      name: 'Serviços',
      icon: <BriefcaseIcon className="size-6" />,
      navigateTo: '/management/services',
    },
    {
      name: 'Turnos',
      icon: <ClockIcon className="size-6" />,
      navigateTo: '/professional-shifts',
    },
    {
      name: 'Home',
      icon: <HomeIcon className="size-6" />,
      navigateTo: '/professional/home',
    },
  ],
}

export default sideBarItems
