import React from 'react'
import './coin.css'

interface CoinProps {
  prize?: number
  isPlaying: boolean
  stopAnimation: () => void
}

export const Coin: React.FC<CoinProps> = ({ prize, isPlaying, stopAnimation }) => {
  const [result, setResult] = React.useState('?')
  const coinRef = React.useRef<HTMLDivElement>(null)

  // Evitar actualizaciones innecesarias de `result`
  React.useEffect(() => {
    if (!isPlaying && prize !== undefined) {
      const newResult = prize === 0 ? '0' : '1'
      if (result !== newResult) {
        setResult(newResult)
      }
    } else if (isPlaying && result !== '?') {
      setResult('?')
    }
  }, [isPlaying, prize, result])

  // Memoizar la función para evitar recrearla en cada renderizado
  const handleAnimationEnd = React.useCallback(() => {
    stopAnimation()
  }, [stopAnimation])

  // Agregar y remover el event listener de manera segura
  React.useEffect(() => {
    const coinElement = coinRef.current
    if (!isPlaying || !coinElement) return

    coinElement.addEventListener('animationend', handleAnimationEnd)

    return () => {
      coinElement.removeEventListener('animationend', handleAnimationEnd)
    }
  }, [isPlaying, handleAnimationEnd])

  return (
    <div className='flex flex-col items-center justify-center h-96'>
      <div className='coin-container'>
        <div className='coin-bounds'>
          <div className={`coin ${isPlaying ? 'spin' : 'idle'} ${isPlaying ? 'glow' : ''}`} ref={coinRef}>
            <div className='back'>
              <p>{result}</p>
            </div>
            <div className='edge-front'></div>
            <div className='center'></div>
            <div className='edge-back'></div>
            <div className='front'>
              <p>{result}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
