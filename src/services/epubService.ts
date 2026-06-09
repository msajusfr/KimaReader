import ePub from 'epubjs'
import type { BookRecord } from '../types/book'
import { createId } from '../utils/ids'

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

const dataUrlToArrayBuffer = async (dataUrl: string) => {
  const response = await fetch(dataUrl)
  return response.arrayBuffer()
}

export const epubService = {
  async importBook(file: File): Promise<BookRecord> {
    const dataUrl = await fileToDataUrl(file)
    const book = ePub(await dataUrlToArrayBuffer(dataUrl))

    let title = file.name.replace(/\.epub$/i, '')
    let author = 'Auteur inconnu'
    let coverUrl: string | undefined

    try {
      await book.ready
      const metadata = await book.loaded.metadata
      title = metadata.title || title
      author = metadata.creator || author
      coverUrl = (await book.coverUrl()) || undefined
    } finally {
      book.destroy()
    }

    return {
      id: createId('book'),
      title,
      author,
      fileName: file.name,
      dataUrl,
      coverUrl,
      progress: 0,
      importedAt: new Date().toISOString(),
    }
  },
  dataUrlToArrayBuffer,
}
