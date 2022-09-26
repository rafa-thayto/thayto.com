import { useState } from 'react'

interface ButtonProps {
  onBeepBoop?: (isBoop: boolean) => void
}

export const Button = ({ onBeepBoop }: ButtonProps) => {
  const [toogle, setToogle] = useState(false)

  return (
    <button
      type="button"
      className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
      onClick={() => {
        setToogle(oldState => !oldState)
        onBeepBoop?.(toogle)
      }}
    >
      {toogle ? 'Boop' : 'Beep'}
    </button>
  )
}
