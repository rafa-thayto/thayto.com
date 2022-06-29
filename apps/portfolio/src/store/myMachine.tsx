import { ActorRefFrom, StateFrom } from 'xstate'
import { createModel } from 'xstate/lib/model'

export const myModel = createModel(undefined, {
  events: {
    button1Clicked: () => ({}),
    button2Clicked: () => ({}),
    button3Clicked: () => ({}),
  },
})

export const myMachine = myModel.createMachine({
  id: 'myMachine',
  initial: `state1`,
  on: {
    button1Clicked: `state1`,
    button2Clicked: `state2`,
    button3Clicked: `state3`,
  },
  states: {
    state1: {},
    state2: {},
    state3: {},
  },
})

export type MyService = ActorRefFrom<typeof myMachine>

type MyMachineState = StateFrom<typeof myMachine>

export function selectIsState3(state: MyMachineState) {
  return state.matches('state3')
}
