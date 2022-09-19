import { MyContext } from '@infra/store/xstate/contexts'
import { myModel } from '@infra/store/xstate/myMachine'
import { useActor } from '@xstate/react'
import { useContext } from 'react'

export const ComponentA = () => {
  const globalState = useContext(MyContext)
  const [state, send] = useActor(globalState.service)

  return (
    <section>
      <h1>Component A</h1>
      <output>
        state: <strong>{state.value}</strong>
      </output>
      <button
        type="button"
        onClick={() => send(myModel.events.button1Clicked())}
      >
        BUTTON 1
      </button>
      <button
        type="button"
        onClick={() => send(myModel.events.button2Clicked())}
      >
        BUTTON 2
      </button>
      <button
        type="button"
        onClick={() => send(myModel.events.button3Clicked())}
      >
        BUTTON 3
      </button>
    </section>
  )
}
