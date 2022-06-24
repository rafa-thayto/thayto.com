import { useState } from 'react'

export const Button = () => {
  const [toogle, setToogle] = useState(false)

  return (
    <button
      onClick={() => {
        setToogle((oldState) => !oldState)
      }}
    >
      {toogle ? 'Boop' : 'Beep'}
    </button>
  )
}
