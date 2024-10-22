import React from 'react';

interface ShortcutProps {
  imageSrc: string;
  link: string;
}

export const Shortcut: React.FC<ShortcutProps> = ({ imageSrc, link }) => {
  const openLink = () => {
    window.open(link, '_blank');
  };

  return (
    <td className="enlace flex justify-center items-center h-full" onClick={openLink}>
      <img
        src={imageSrc}
        alt="Shortcut icon"
        className=" object-contain cursor-pointer "
      />
    </td>
  );
};
