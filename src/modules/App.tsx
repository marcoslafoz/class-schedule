import { RouterProvider } from 'react-router'
import { router } from '../common/router'
import { NotesProvider } from '../common/context/notes-provider'
import { HeroUIProvider } from '@heroui/system'
import '../assets/scss/main.scss'

export const App: React.FC = () => {
  return (
    <main className=''>
      <HeroUIProvider>
        <NotesProvider>
          <RouterProvider router={router} />
        </NotesProvider>
      </HeroUIProvider>
    </main>
  )
}
