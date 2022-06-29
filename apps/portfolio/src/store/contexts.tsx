import { createContext } from 'react'
import { MyService } from './myMachine'

interface MyContextType {
  service: MyService
}

export const MyContext = createContext({} as MyContextType)
