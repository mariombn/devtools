const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'semper', 'risus',
  'viverra', 'accumsan', 'lacus', 'vel', 'facilisis', 'volutpat', 'mauris',
  'nunc', 'congue', 'nec', 'ultrices', 'dui', 'sapien', 'eget', 'mi', 'proin',
  'libero', 'nunc', 'consequat', 'interdum', 'varius', 'maecenas', 'ultricies',
  'tristique', 'nulla', 'aliquet', 'enim', 'tortor', 'at', 'auctor', 'urna',
  'lectus', 'arcu', 'bibendum', 'elementum', 'integer', 'feugiat', 'scelerisque',
  'varius', 'morbi', 'eros', 'cursus', 'metus', 'aliquam', 'eleifend'
]

export type LoremType = 'paragraphs' | 'sentences' | 'words'

export interface LoremOptions {
  type: LoremType
  count: number
}

function getRandomWord(): string {
  return loremWords[Math.floor(Math.random() * loremWords.length)]
}

function generateWords(count: number): string {
  const words: string[] = []
  for (let i = 0; i < count; i++) {
    words.push(getRandomWord())
  }
  return words.join(' ')
}

function generateSentence(): string {
  const wordCount = Math.floor(Math.random() * 10) + 5 // 5-14 words
  const words = generateWords(wordCount)
  return words.charAt(0).toUpperCase() + words.slice(1) + '.'
}

function generateSentences(count: number): string {
  const sentences: string[] = []
  for (let i = 0; i < count; i++) {
    sentences.push(generateSentence())
  }
  return sentences.join(' ')
}

function generateParagraph(): string {
  const sentenceCount = Math.floor(Math.random() * 4) + 3 // 3-6 sentences
  return generateSentences(sentenceCount)
}

function generateParagraphs(count: number): string {
  const paragraphs: string[] = []
  for (let i = 0; i < count; i++) {
    paragraphs.push(generateParagraph())
  }
  return paragraphs.join('\n\n')
}

export function generateLorem(options: LoremOptions): string {
  const { type, count } = options

  switch (type) {
    case 'words':
      return generateWords(count)
    case 'sentences':
      return generateSentences(count)
    case 'paragraphs':
      return generateParagraphs(count)
    default:
      return generateParagraphs(count)
  }
}
