import React from 'react'
import {
  Button,
  DatePicker,
  DateValue,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Note } from '../../../../common/types/note.vm'
import { NotesContext } from '../../../../common/context/notes-context'

interface CourseAddModalProps {
  isOpen: boolean
  onClose: () => void
}

export const NotesAddModal: React.FC<CourseAddModalProps> = props => {
  const { isOpen, onClose } = props
  const { addNote, refetch } = React.useContext(NotesContext)

  const { handleSubmit, register, reset, setValue } = useForm<Note>()

  const onSuccessAddCourse: SubmitHandler<Note> = async values => {
    const newNote: Note = {
      id: 0,
      icon_url: values.icon_url,
      title: values.title,
      url: values.url,
      autor: values.autor,
      date: values.date,
    }

    try {
      await addNote(newNote)
      onClose()
      refetch()
    } catch (error) {
      console.error('Error añadiendo la nota:', error)
    } finally {
      reset()
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose()
          reset()
        }}
        placement='center'
        backdrop='blur'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1 text-white'>Añadir nota</ModalHeader>

          <form onSubmit={handleSubmit(onSuccessAddCourse)}>
            <ModalBody>
              <Input {...register('title', { required: true })} isRequired placeholder='Título' size='lg' />
              <div className='grid grid-cols-2 gap-3'>
                <DatePicker
                  onChange={(value: DateValue | null) => setValue('date', value ? value.toDate('UTC').toString() : '')}
                  size='sm'
                  label='Fecha'
                />
                <Input {...register('autor', { required: true })} isRequired placeholder='Autor' size='lg' />
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <Input {...register('icon_url', { required: false })} placeholder='Icono (url)' size='lg' />
                <Input {...register('url', { required: false })} placeholder='URL' size='lg' />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                color='danger'
                className='bg-transparent border border-red-500 text-red-500'
                size='sm'
                onPress={() => {
                  onClose()
                  reset()
                }}
              >
                Cancelar
              </Button>
              <Button color='primary' size='sm' type='submit'>
                Añadir
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
