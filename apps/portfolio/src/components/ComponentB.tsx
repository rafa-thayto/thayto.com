import { useSelector } from '@xstate/react'
import { useContext, useEffect, useState } from 'react'
import { MyContext } from '../store/contexts'
import { myModel, selectIsState3 } from '../store/myMachine'

export const ComponentB = () => {
  const globalState = useContext(MyContext)
  const { service } = globalState
  const isState3 = useSelector(service, selectIsState3)
  return (
    <section>
      <h1>Component B</h1>
      <output>
        isState3: <strong>{JSON.stringify(isState3)}</strong>
      </output>
      <button onClick={() => service.send(myModel.events.button1Clicked())}>BUTTON 1</button>
    </section>
  )
}
