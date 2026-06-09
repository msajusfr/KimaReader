import amartima from '../data/books/amartima.json'
import fonissa from '../data/books/fonissa.json'
import taPsilaVouna from '../data/books/ta-psila-vouna.json'
import type { BookContent } from '../types/book'

const books = [taPsilaVouna, fonissa, amartima] as BookContent[]

export const bookService = {
  getBooks: () => books,
  getBookById: (id?: string) => books.find((book) => book.id === id),
}
