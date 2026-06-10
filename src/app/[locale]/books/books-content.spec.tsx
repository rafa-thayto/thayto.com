import { render, screen, fireEvent, within } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import ptMessages from '@/messages/pt.json'
import { BooksContent } from './books-content'
import type { Book } from '@/data/books.types'

// Fixtures: 5 books spanning all relevant test dimensions
const fixtures: Book[] = [
  {
    id: '1',
    title: 'Código Limpo',
    englishTitle: 'Clean Code',
    author: 'Robert C. Martin',
    coverUrl: '/clean-code.jpg',
    amazonUrl: 'https://amzn.to/clean-code',
    status: 'READ',
    stars: 5,
    love: true,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'Arquitetura Limpa',
    englishTitle: 'Clean Architecture',
    author: 'Robert C. Martin',
    coverUrl: '/clean-arch.jpg',
    status: 'READ',
    stars: 4,
    love: false,
    createdAt: '2024-02-01',
  },
  {
    id: '3',
    title: 'O Mítico Homem-Mês',
    englishTitle: 'The Mythical Man-Month',
    author: 'Fred Brooks',
    coverUrl: '/mythical.jpg',
    status: 'READING',
    createdAt: '2024-03-01',
  },
  {
    id: '4',
    title: 'Pragmatic Programmer',
    englishTitle: 'Pragmatic Programmer',
    author: 'David Thomas',
    coverUrl: '/pragmatic.jpg',
    status: 'WILL_READ',
    love: true,
    createdAt: '2024-04-01',
  },
  {
    id: '5',
    title: 'Entregando Software',
    englishTitle: 'Continuous Delivery',
    author: 'Jez Humble',
    coverUrl: '/cd.jpg',
    status: 'DROPPED',
    stars: 2,
    createdAt: '2023-12-01',
  },
]

function renderBooksContent(books: Book[] = fixtures, locale = 'pt') {
  return render(
    <NextIntlClientProvider locale="pt" messages={ptMessages}>
      <BooksContent books={books} locale={locale} />
    </NextIntlClientProvider>,
  )
}

// Helper: returns rendered h3 title texts in DOM order
function getRenderedTitles(): string[] {
  return screen
    .getAllByRole('heading', { level: 3 })
    .map((el) => el.textContent ?? '')
}

describe('BooksContent', () => {
  it('renders all books initially', () => {
    renderBooksContent()

    // Default sort is createdAt desc: fixture ids 4,3,2,1,5 by date
    expect(screen.getByText('Pragmatic Programmer')).toBeInTheDocument()
    expect(screen.getByText('O Mítico Homem-Mês')).toBeInTheDocument()
    expect(screen.getByText('Arquitetura Limpa')).toBeInTheDocument()
    expect(screen.getByText('Código Limpo')).toBeInTheDocument()
    expect(screen.getByText('Entregando Software')).toBeInTheDocument()
  })

  it('uses pt book.title when locale is pt', () => {
    renderBooksContent(fixtures, 'pt')

    // Portuguese titles shown
    expect(screen.getByText('Código Limpo')).toBeInTheDocument()
    // English title should NOT appear as a heading (Clean Code is the englishTitle)
    const headings = screen.getAllByRole('heading', { level: 3 })
    const headingTexts = headings.map((h) => h.textContent)
    expect(headingTexts).not.toContain('Clean Code')
  })

  it('uses englishTitle when locale is en', () => {
    renderBooksContent(fixtures, 'en')

    expect(screen.getByText('Clean Code')).toBeInTheDocument()
    // Portuguese-only title must not appear
    const headings = screen.getAllByRole('heading', { level: 3 })
    const headingTexts = headings.map((h) => h.textContent)
    expect(headingTexts).not.toContain('Código Limpo')
  })

  it('clicking READ filter narrows to READ books', () => {
    renderBooksContent()

    const readButton = screen.getByRole('button', { name: /lido/i })
    fireEvent.click(readButton)

    expect(screen.getByText('Código Limpo')).toBeInTheDocument()
    expect(screen.getByText('Arquitetura Limpa')).toBeInTheDocument()
    expect(screen.queryByText('O Mítico Homem-Mês')).not.toBeInTheDocument()
    expect(screen.queryByText('Pragmatic Programmer')).not.toBeInTheDocument()
    expect(screen.queryByText('Entregando Software')).not.toBeInTheDocument()
  })

  it('clicking READING filter narrows to READING books', () => {
    renderBooksContent()

    const readingButton = screen.getByRole('button', { name: /lendo/i })
    fireEvent.click(readingButton)

    expect(screen.getByText('O Mítico Homem-Mês')).toBeInTheDocument()
    expect(screen.queryByText('Código Limpo')).not.toBeInTheDocument()
    expect(screen.queryByText('Arquitetura Limpa')).not.toBeInTheDocument()
    expect(screen.queryByText('Pragmatic Programmer')).not.toBeInTheDocument()
    expect(screen.queryByText('Entregando Software')).not.toBeInTheDocument()
  })

  it('clicking the active filter again deselects it (toggle off)', () => {
    renderBooksContent()

    const readButton = screen.getByRole('button', { name: /lido/i })
    fireEvent.click(readButton)
    // Filter active: only READ books
    expect(screen.queryByText('O Mítico Homem-Mês')).not.toBeInTheDocument()

    // Click again to deselect
    fireEvent.click(readButton)
    // All books back
    expect(screen.getByText('O Mítico Homem-Mês')).toBeInTheDocument()
    expect(screen.getByText('Código Limpo')).toBeInTheDocument()
  })

  it('clicking Favorites shows only love===true books', () => {
    renderBooksContent()

    const favButton = screen.getByRole('button', { name: /favoritos/i })
    fireEvent.click(favButton)

    // love: true -> fixture 1 (Código Limpo) and fixture 4 (Pragmatic Programmer)
    expect(screen.getByText('Código Limpo')).toBeInTheDocument()
    expect(screen.getByText('Pragmatic Programmer')).toBeInTheDocument()
    expect(screen.queryByText('Arquitetura Limpa')).not.toBeInTheDocument()
    expect(screen.queryByText('O Mítico Homem-Mês')).not.toBeInTheDocument()
    expect(screen.queryByText('Entregando Software')).not.toBeInTheDocument()
  })

  it('shows noResults message when a filter matches nothing', () => {
    renderBooksContent()

    // BUY filter — no fixture has status BUY
    const buyButton = screen.getByRole('button', { name: /comprar/i })
    fireEvent.click(buyButton)

    expect(
      screen.getByText('Nenhum livro encontrado com os filtros selecionados.'),
    ).toBeInTheDocument()
    // No book headings rendered
    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0)
  })

  it('DROPPED filter matches one book and hides others', () => {
    renderBooksContent()

    const droppedButton = screen.getByRole('button', { name: /abandonado/i })
    fireEvent.click(droppedButton)

    expect(screen.getByText('Entregando Software')).toBeInTheDocument()
    expect(screen.queryByText('Código Limpo')).not.toBeInTheDocument()
  })

  it('BEST sort orders books by stars descending', () => {
    renderBooksContent()

    const bestButton = screen.getByRole('button', { name: /melhores/i })
    fireEvent.click(bestButton)

    const titles = getRenderedTitles()
    // stars: Código Limpo=5, Arquitetura Limpa=4, Entregando Software=2, rest=0
    // BEST sort: (b.stars||0) - (a.stars||0) desc
    const codigoIdx = titles.indexOf('Código Limpo')
    const arquiteturaIdx = titles.indexOf('Arquitetura Limpa')
    const entregandoIdx = titles.indexOf('Entregando Software')

    expect(codigoIdx).toBeLessThan(arquiteturaIdx)
    expect(arquiteturaIdx).toBeLessThan(entregandoIdx)
  })

  it('WORST sort orders books by stars ascending (lowest first)', () => {
    renderBooksContent()

    const worstButton = screen.getByRole('button', { name: /piores/i })
    fireEvent.click(worstButton)

    const titles = getRenderedTitles()
    // WORST sort: (a.stars||0) - (b.stars||0) asc — 0,0,2,4,5
    const codigoIdx = titles.indexOf('Código Limpo')
    const arquiteturaIdx = titles.indexOf('Arquitetura Limpa')
    const entregandoIdx = titles.indexOf('Entregando Software')

    // Código Limpo (5 stars) should come AFTER Entregando Software (2 stars) in WORST sort
    expect(entregandoIdx).toBeLessThan(arquiteturaIdx)
    expect(arquiteturaIdx).toBeLessThan(codigoIdx)
  })

  it('ABC sort orders books alphabetically A-Z by pt title', () => {
    renderBooksContent()

    const abcButton = screen.getByRole('button', { name: /a-z/i })
    fireEvent.click(abcButton)

    const titles = getRenderedTitles()
    // Alphabetical: Arquitetura < Código < Entregando < O Mítico < Pragmatic
    const arquiteturaIdx = titles.indexOf('Arquitetura Limpa')
    const codigoIdx = titles.indexOf('Código Limpo')
    const pragmaticIdx = titles.indexOf('Pragmatic Programmer')

    expect(arquiteturaIdx).toBeLessThan(codigoIdx)
    expect(codigoIdx).toBeLessThan(pragmaticIdx)
  })

  it('ZXY sort orders books alphabetically Z-A by pt title', () => {
    renderBooksContent()

    const zxyButton = screen.getByRole('button', { name: /z-a/i })
    fireEvent.click(zxyButton)

    const titles = getRenderedTitles()
    // Reverse alphabetical: Pragmatic first, Arquitetura last
    const arquiteturaIdx = titles.indexOf('Arquitetura Limpa')
    const codigoIdx = titles.indexOf('Código Limpo')
    const pragmaticIdx = titles.indexOf('Pragmatic Programmer')

    expect(pragmaticIdx).toBeLessThan(codigoIdx)
    expect(codigoIdx).toBeLessThan(arquiteturaIdx)
  })

  it('clicking an active sort button deselects it (toggle off)', () => {
    renderBooksContent()

    const bestButton = screen.getByRole('button', { name: /melhores/i })
    fireEvent.click(bestButton)

    const titlesAfterSort = getRenderedTitles()
    expect(titlesAfterSort[0]).toBe('Código Limpo') // 5 stars, first in BEST

    // Click again to deselect => back to default createdAt desc sort
    fireEvent.click(bestButton)

    const titlesAfterDeselect = getRenderedTitles()
    // Default sort: createdAt desc — fixture 4 (2024-04-01) is newest
    expect(titlesAfterDeselect[0]).toBe('Pragmatic Programmer')
  })

  it('status filter and favorites can be combined', () => {
    renderBooksContent()

    // Enable favorites first
    const favButton = screen.getByRole('button', { name: /favoritos/i })
    fireEvent.click(favButton)

    // Then filter by READ — only Código Limpo has both love:true AND status:READ
    const readButton = screen.getByRole('button', { name: /lido/i })
    fireEvent.click(readButton)

    expect(screen.getByText('Código Limpo')).toBeInTheDocument()
    expect(screen.queryByText('Pragmatic Programmer')).not.toBeInTheDocument()
    expect(screen.queryByText('Arquitetura Limpa')).not.toBeInTheDocument()
  })

  it('renders sidebar navigation labels from translations', () => {
    renderBooksContent()

    expect(screen.getByText('Voltar')).toBeInTheDocument()
    expect(screen.getByText('Filtros')).toBeInTheDocument()
    expect(screen.getByText('Ordenar')).toBeInTheDocument()
    expect(screen.getByText('Idioma')).toBeInTheDocument()
  })

  it('renders page title and subtitle from translations', () => {
    renderBooksContent()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Livros' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Minha pequena biblioteca.')).toBeInTheDocument()
  })
})
