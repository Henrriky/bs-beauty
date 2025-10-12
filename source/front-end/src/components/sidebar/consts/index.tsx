import {
  ArrowLeftStartOnRectangleIcon,
  BellAlertIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  HomeIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
  UserIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import React from 'react'
import { UserType } from '../../../store/auth/types'
import { UserCanAccessProps } from '../../../utils/authorization/authorization.utils'

type SideBarItem = {
  name: string
  navigateTo: string
  icon: React.ReactNode
  order?: number
  authorization: Omit<UserCanAccessProps, 'user'>
}

const onlyCustomerSideBarItems: SideBarItem[] = [
  {
    name: 'Home',
    icon: <HomeIcon className="size-6" />,
    navigateTo: '/customer/home',
    order: 1,
    authorization: {
      allowedPermissions: [],
      allowedUserTypes: [UserType.CUSTOMER],
    },
  },
]

const onlyManagerSideBarItems: SideBarItem[] = [
  {
    name: 'Home',
    icon: <HomeIcon className="size-6" />,
    navigateTo: '/manager/home',
    authorization: {
      allowedPermissions: [],
      allowedUserTypes: [UserType.MANAGER],
    },
  },
]

const onlyProfessionalSideBarItems: SideBarItem[] = [
  {
    name: 'Home',
    icon: <HomeIcon className="size-6" />,
    navigateTo: '/professional/home',
    authorization: {
      allowedPermissions: [],
      allowedUserTypes: [UserType.PROFESSIONAL],
    },
  },
]

const sideBarItems: SideBarItem[] = [
  {
    name: 'Sair',
    icon: <ArrowLeftStartOnRectangleIcon className="size-6" />,
    navigateTo: '/',
    order: 99,
    authorization: {
      allowedPermissions: [],
      allowedUserTypes: [
        UserType.MANAGER,
        UserType.PROFESSIONAL,
        UserType.CUSTOMER,
      ],
    },
  },
  {
    name: 'Perfil',
    icon: <UserIcon className="size-6" />,
    navigateTo: '/profile',
    order: 98,
    authorization: {
      allowedPermissions: [],
      allowedUserTypes: [
        UserType.MANAGER,
        UserType.PROFESSIONAL,
        UserType.CUSTOMER,
      ],
    },
  },
  {
    name: 'Notificações',
    icon: <BellAlertIcon className="size-6" />,
    navigateTo: '/notifications',
    authorization: {
      allowedPermissions: [],
      allowedUserTypes: [
        UserType.MANAGER,
        UserType.PROFESSIONAL,
        UserType.CUSTOMER,
      ],
    }
  },
  {
    name: 'Comunicação',
    icon: <MegaphoneIcon className="size-6" />,
    navigateTo: '/manager/notification-templates',
    authorization: {
      allowedPermissions: [],
      allowedUserTypes: [UserType.MANAGER],
    }
  },
  {
    name: 'Turnos',
    icon: <ClockIcon className="size-6" />,
    navigateTo: '/shifts',
    authorization: {
      allowedPermissions: [],
      allowedUserTypes: [UserType.PROFESSIONAL, UserType.MANAGER],
    },
  },
  {
    name: 'Funções',
    icon: <ShieldCheckIcon className="size-6" />,
    navigateTo: '/manager/roles',
    authorization: {
      strategy: 'ANY',
      allowedPermissions: [
        'roles.read',
        'roles.create',
        'roles.edit',
        'roles.delete',
        'roles.change_permissions',
      ],
      allowedUserTypes: [UserType.MANAGER],
    },
  },
  {
    name: 'Profissionais',
    icon: <ClipboardDocumentCheckIcon className="size-6" />,
    navigateTo: '/manager/professionals',
    authorization: {
      strategy: 'ANY',
      allowedPermissions: [
        'professional.read',
        'professional.create',
        'professional.delete',
        'professional.edit',
        'professional.manage_roles',
      ],
      allowedUserTypes: [UserType.MANAGER],
    },
  },
  {
    name: 'Clientes',
    icon: <UsersIcon className="size-6" />,
    navigateTo: '/manager/customers',
    authorization: {
      strategy: 'ANY',
      allowedPermissions: ['customer.read', 'customer.delete'],
      allowedUserTypes: [UserType.MANAGER],
    },
  },
  {
    name: 'Serviços',
    icon: <BriefcaseIcon className="size-6" />,
    navigateTo: 'services',
    authorization: {
      allowedPermissions: [],
      allowedUserTypes: [UserType.PROFESSIONAL, UserType.MANAGER],
    },
  },
  {
    name: 'Agendamentos',
    icon: <CalendarDaysIcon className="size-6" />,
    navigateTo: '/appointments',
    authorization: {
      allowedPermissions: [],
      allowedUserTypes: [
        UserType.MANAGER,
        UserType.PROFESSIONAL,
        UserType.CUSTOMER,
      ],
    },
  },
  ...onlyCustomerSideBarItems,
  ...onlyManagerSideBarItems,
  ...onlyProfessionalSideBarItems,
]

export default sideBarItems
