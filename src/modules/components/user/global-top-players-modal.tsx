import React from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from '@heroui/react'
import { TursoClient } from '../../../common/api/turso/config/client'
import { UserTop } from '../../../common/types'
import { RenderMedals } from '../../../common/utils/user'

interface GlobalTopPlayersProps {
  isOpen: boolean
  onClose: () => void
}

export const GlobalTopPlayersModal: React.FC<GlobalTopPlayersProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [users, setUsers] = React.useState<UserTop[]>([])
  const [page, setPage] = React.useState<number>(1)
  const [totalPages, setTotalPages] = React.useState<number>(1)
  const rowsPerPage = 10

  const fetchTopPlayers = async (page: number) => {
    setLoading(true)
    try {
      const offset = (page - 1) * rowsPerPage
      const result = await TursoClient.execute(
        `SELECT username, money, avatar_url FROM user WHERE last_login NOT LIKE "NULL" AND money > 0 ORDER BY money DESC LIMIT ${rowsPerPage} OFFSET ${offset}`
      )

      const countResult = await TursoClient.execute(
        'SELECT COUNT(*) as total FROM user WHERE last_login NOT LIKE "NULL" AND money > 0'
      )

      const formattedUsers: UserTop[] = result.rows.map((row: any) => ({
        username: row.username,
        money: row.money,
        avatar_url: row.avatar_url,
      }))

      const totalRecords = parseInt(String(countResult.rows[0]?.total || '0'), 10)
      setUsers(formattedUsers)
      setTotalPages(Math.ceil(totalRecords / rowsPerPage))
    } catch (error) {
      console.error('Error fetching top players:', error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (isOpen) {
      fetchTopPlayers(page)
    }
  }, [isOpen, page])

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement='center' backdrop='blur'>
      <ModalContent>
        <ModalHeader className='flex flex-row text-white gap-3 flex-wrap justify-center items-center'>
          TOP GLOBAL
        </ModalHeader>
        <ModalBody className='flex flex-col justify-center items-center'>
          {loading ? (
            <Spinner size='lg' color='white' />
          ) : (
            <Table
              classNames={{ wrapper: 'shadow-none' }}
              bottomContent={
                totalPages > 1 && (
                  <div className='flex w-full justify-center'>
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color='primary'
                      page={page}
                      total={totalPages}
                      onChange={setPage}
                    />
                  </div>
                )
              }
            >
              <TableHeader>
                <TableColumn>#</TableColumn>
                <TableColumn>Username</TableColumn>
                <TableColumn>Money</TableColumn>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                    <TableCell className='flex flex-row items-center gap-3'>
                      <img
                        src={user.avatar_url || '/assets/avatar/default.png'}
                        alt={user.username}
                        className='h-5 w-5 object-cover aspect-square rounded-full'
                      />

                      {`${RenderMedals((page - 1) * rowsPerPage + index)} ${user.username}`}
                    </TableCell>
                    <TableCell>{user.money} 💸</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
