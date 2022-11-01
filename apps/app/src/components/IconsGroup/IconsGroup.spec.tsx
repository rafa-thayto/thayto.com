import { render } from '@testing-library/react'

import { IconsGroup } from './'

jest.mock('nanoid', () => {
  return { nanoid: () => '1234' }
})

describe('IconsGroup', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<IconsGroup />)
    expect(baseElement).toBeTruthy()
  })
})
