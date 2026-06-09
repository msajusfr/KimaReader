export const speechService = {
  getGreekVoices() {
    if (!('speechSynthesis' in window)) return []
    return window.speechSynthesis
      .getVoices()
      .filter((voice) => voice.lang.toLowerCase().startsWith('el'))
  },
  speak(text: string, voiceURI?: string) {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'el-GR'
    utterance.rate = 0.88
    const voice = this.getGreekVoices().find((item) => item.voiceURI === voiceURI)
    if (voice) utterance.voice = voice
    window.speechSynthesis.speak(utterance)
  },
  stop() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  },
}
