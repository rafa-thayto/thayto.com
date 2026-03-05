#!/usr/bin/env node

/**
 * Helper script to add books to books.json
 *
 * Usage:
 *   node scripts/add-book.js
 *
 * Then follow the prompts to add a book interactively.
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve))

async function addBook() {
  console.log('\n📚 Add a new book to your library\n')

  const title = await question('Portuguese title: ')
  const englishTitle = await question('English title: ')
  const author = await question('Author: ')
  const coverUrl = await question('Cover URL (from Amazon): ')
  const amazonUrl = await question('Amazon URL (optional): ')
  const status = await question('Status (READ/READING/BUY/WILL_READ/DROPPED): ')
  const stars = await question('Stars (1-5, optional, press enter to skip): ')
  const love = await question('Favorite? (y/n, optional): ')

  const book = {
    id: String(Date.now()),
    title,
    englishTitle,
    author,
    coverUrl,
    ...(amazonUrl && { amazonUrl }),
    status: status.toUpperCase(),
    ...(stars && { stars: parseInt(stars) }),
    ...(love === 'y' && { love: true }),
    createdAt: new Date().toISOString(),
  }

  // Read existing books
  const booksPath = path.join(__dirname, '..', 'src', 'data', 'books.json')
  const existingBooks = JSON.parse(fs.readFileSync(booksPath, 'utf-8'))

  // Add new book
  existingBooks.push(book)

  // Write back
  fs.writeFileSync(booksPath, JSON.stringify(existingBooks, null, 2))

  console.log('\n✅ Book added successfully!')
  console.log(JSON.stringify(book, null, 2))

  const addAnother = await question('\nAdd another book? (y/n): ')
  if (addAnother.toLowerCase() === 'y') {
    await addBook()
  } else {
    rl.close()
  }
}

addBook().catch((err) => {
  console.error('Error:', err)
  rl.close()
  process.exit(1)
})
