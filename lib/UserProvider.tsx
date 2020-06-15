import React from 'react'
import { User } from './user'

const UserContext = React.createContext<User | null>(null)

export const UserProvider = UserContext.Provider
export const UserConsumer = UserContext.Consumer

export default UserContext