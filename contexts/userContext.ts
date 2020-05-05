import { createContext } from "react"
import { User } from "../lib/user"

const UserContext = createContext<User | null>(null)

export default UserContext