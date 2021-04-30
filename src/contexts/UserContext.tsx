import { createContext, FC, useContext, useState } from 'react'

export type User = {
  userId: number
  firstName: string
  lastName: string
  username: string
  email: string
}

type UserContextType = {
  user?: User
  setUserContext: (user?: User) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const ctx = useContext(UserContext);

  if (!ctx) {
    throw new Error('app must be wrapped in a UserContextProvider');
  }

  return ctx;
}

const UserContextProvider: FC = (props) => {
  const [ activeUser, setActiveUser ] = useState<User>();

  return (
    <UserContext.Provider value={{ user: activeUser, setUserContext: setActiveUser }}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;