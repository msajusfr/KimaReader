import { useEffect, useState } from 'react'
import type { ReaderPreferences } from '../types/book'
import { storageService } from '../services/storageService'

export const useTheme = () => {
  const [preferences, setPreferences] = useState<ReaderPreferences>(() =>
    storageService.getPreferences(),
  )

  useEffect(() => {
    document.documentElement.classList.toggle('light', preferences.theme === 'light')
    storageService.savePreferences(preferences)
  }, [preferences])

  return { preferences, setPreferences }
}
