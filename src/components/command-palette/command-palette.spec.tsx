import { fireEvent, render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import en from '@/messages/en.json'
import { CommandPalette, OPEN_COMMAND_PALETTE_EVENT } from './command-palette'
import { CommandPaletteTrigger } from './command-palette-trigger'

// cmdk relies on ResizeObserver and scrollIntoView, which happy-dom lacks
vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
)
Element.prototype.scrollIntoView =
  Element.prototype.scrollIntoView ?? (() => {})

const pushMock = vi.fn()
const replaceMock = vi.fn()
const openMock = vi.fn()
vi.stubGlobal('open', openMock)

vi.mock('@/i18n/routing', () => ({
  usePathname: () => '/blog',
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
}))

vi.mock('next/navigation', () => ({
  useParams: () => ({}),
}))

vi.mock('posthog-js', () => ({
  default: { capture: vi.fn() },
}))

const posts = [
  { title: 'My first post', slug: 'my-first-post', tags: ['career'] },
  { title: 'Another post', slug: 'another-post', tags: ['tech'] },
]

const books = [
  {
    id: 'pragmatic',
    title: 'The Pragmatic Programmer',
    author: 'Hunt & Thomas',
    amazonUrl: 'https://amazon.com/pragmatic',
  },
  { id: 'sicp', title: 'SICP', author: 'Abelson & Sussman' },
]

const renderPalette = () =>
  render(
    <NextIntlClientProvider locale="en" messages={en}>
      <CommandPalette posts={posts} books={books} />
    </NextIntlClientProvider>,
  )

describe('CommandPalette', () => {
  it('is closed by default', () => {
    renderPalette()
    expect(
      screen.queryByPlaceholderText(en.commandPalette.placeholder),
    ).toBeNull()
  })

  it('opens with cmd+k and closes with a second cmd+k', () => {
    renderPalette()

    fireEvent.keyDown(document, { key: 'k', metaKey: true })
    expect(
      screen.getByPlaceholderText(en.commandPalette.placeholder),
    ).toBeTruthy()

    fireEvent.keyDown(document, { key: 'k', metaKey: true })
    expect(
      screen.queryByPlaceholderText(en.commandPalette.placeholder),
    ).toBeNull()
  })

  it('opens with ctrl+k', () => {
    renderPalette()
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
    expect(
      screen.getByPlaceholderText(en.commandPalette.placeholder),
    ).toBeTruthy()
  })

  it('does not open when typing cmd+k inside an input', () => {
    renderPalette()
    const input = document.createElement('input')
    document.body.appendChild(input)

    fireEvent.keyDown(input, { key: 'k', metaKey: true })
    expect(
      screen.queryByPlaceholderText(en.commandPalette.placeholder),
    ).toBeNull()

    input.remove()
  })

  it(`opens via the ${OPEN_COMMAND_PALETTE_EVENT} window event`, () => {
    renderPalette()
    fireEvent(window, new Event(OPEN_COMMAND_PALETTE_EVENT))
    expect(
      screen.getByPlaceholderText(en.commandPalette.placeholder),
    ).toBeTruthy()
  })

  it('lists pages, posts, books, actions and external links when open', () => {
    renderPalette()
    fireEvent.keyDown(document, { key: 'k', metaKey: true })

    expect(screen.getByText('My first post')).toBeTruthy()
    expect(screen.getByText('Another post')).toBeTruthy()
    expect(screen.getByText('The Pragmatic Programmer')).toBeTruthy()
    expect(screen.getByText('SICP')).toBeTruthy()
    expect(screen.getByText(en.commandPalette.toggleTheme)).toBeTruthy()
    expect(screen.getByText('GitHub')).toBeTruthy()
    // "Books" renders twice now: the Pages nav item and the Books group heading.
    expect(
      screen.getAllByText(en.commandPalette.page.books).length,
    ).toBeGreaterThanOrEqual(2)
  })

  it('navigates to a post on select and closes', () => {
    renderPalette()
    fireEvent.keyDown(document, { key: 'k', metaKey: true })

    fireEvent.click(screen.getByText('My first post'))

    expect(pushMock).toHaveBeenCalledWith('/blog/my-first-post')
    expect(
      screen.queryByPlaceholderText(en.commandPalette.placeholder),
    ).toBeNull()
  })

  it('opens a book amazon link in a new tab on select and closes', () => {
    renderPalette()
    fireEvent.keyDown(document, { key: 'k', metaKey: true })

    fireEvent.click(screen.getByText('The Pragmatic Programmer'))

    expect(openMock).toHaveBeenCalledWith(
      'https://amazon.com/pragmatic',
      '_blank',
      'noopener,noreferrer',
    )
    expect(
      screen.queryByPlaceholderText(en.commandPalette.placeholder),
    ).toBeNull()
  })

  it('navigates to the library for a book without an amazon link', () => {
    renderPalette()
    fireEvent.keyDown(document, { key: 'k', metaKey: true })

    fireEvent.click(screen.getByText('SICP'))

    expect(pushMock).toHaveBeenCalledWith('/books')
    expect(
      screen.queryByPlaceholderText(en.commandPalette.placeholder),
    ).toBeNull()
  })

  it('closes with cmd+k while the search input is focused', () => {
    renderPalette()
    fireEvent.keyDown(document, { key: 'k', metaKey: true })

    // The second Cmd+K lands on the focused search input (an editable target);
    // it must still toggle the palette closed.
    const input = screen.getByPlaceholderText(en.commandPalette.placeholder)
    fireEvent.keyDown(input, { key: 'k', metaKey: true })

    expect(
      screen.queryByPlaceholderText(en.commandPalette.placeholder),
    ).toBeNull()
  })
})

describe('CommandPaletteTrigger', () => {
  it('dispatches the open event on click', () => {
    const listener = vi.fn()
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, listener)

    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <CommandPaletteTrigger />
      </NextIntlClientProvider>,
    )

    fireEvent.click(
      screen.getByRole('button', { name: en.commandPalette.openLabel }),
    )
    expect(listener).toHaveBeenCalled()

    window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, listener)
  })
})
