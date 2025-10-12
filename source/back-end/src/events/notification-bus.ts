import { EventEmitter } from 'events'

export const notificationBus = new EventEmitter()
notificationBus.setMaxListeners(50)
