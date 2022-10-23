import { render } from '@testing-library/react'

import { IconsGroup } from './'

describe('IconsGroup', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<IconsGroup />)
    expect(baseElement).toBeTruthy()
  })
})
