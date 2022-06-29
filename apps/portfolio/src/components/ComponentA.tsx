import { useActor } from '@xstate/react'
import { useContext } from 'react'
import { MyContext } from '../store/contexts'
import { myModel } from '../store/myMachine'

export const ComponentA = () => {
  const globalState = useContext(MyContext)
  const [state, send] = useActor(globalState.service)

  return (
    <section>
      <h1>Component A</h1>
      <output>
        state: <strong>{state.value}</strong>
      </output>
      <button onClick={() => send(myModel.events.button1Clicked())}>BUTTON 1</button>
      <button onClick={() => send(myModel.events.button2Clicked())}>BUTTON 2</button>
      <button onClick={() => send(myModel.events.button3Clicked())}>BUTTON 3</button>
    </section>
  )
}
