import { RouterProvider } from 'react-router'
import { router } from '../common/router'
import { HeroUIProvider } from '@heroui/system'
import '../assets/scss/main.scss'
import { UserProvider } from '../common/context/user-context'

export const App: React.FC = () => {
  return (
    <main>
      <UserProvider>
        <HeroUIProvider>
          <RouterProvider router={router} />
        </HeroUIProvider>
      </UserProvider>
    </main>
  )
}
