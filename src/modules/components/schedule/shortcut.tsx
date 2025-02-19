import React from 'react'

interface ShortcutProps {
  imageSrc: string
  link: string
}

export const Shortcut: React.FC<ShortcutProps> = ({ imageSrc, link }) => {
  const openLink = () => {
    window.open(link, '_blank')
  }

  return (
    <td
      className='hidden lg:flex rounded-xl text-white bg-[#353535] w-20 h-20 px-2 py-1 text-xs justify-center items-center cursor-pointer'
      onClick={openLink}
    >
      <img
        src={imageSrc}
        alt='Shortcut icon'
        className='w-2/3 h-2/3 object-contain transition-transform duration-200 ease-in-out filter grayscale hover:grayscale-0 hover:scale-105'
      />
    </td>
  )
}
