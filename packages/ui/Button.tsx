import { useState } from 'react'

export const Button = () => {
  const [toogle, setToogle] = useState(false)

  return (
    <button
      className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 p"
      onClick={() => {
        setToogle(oldState => !oldState)
      }}
    >
      {toogle ? 'Boop' : 'Beep'}
    </button>
  )
}
