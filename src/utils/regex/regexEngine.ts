export interface RegexMatch {
  fullMatch: string
  index: number
  endIndex: number
  groups: Record<string, string | undefined>
  captures: (string | undefined)[]
}

export interface RegexResult {
  matches: RegexMatch[]
  error: string | null
}

export function buildRegex(
  pattern: string,
  flags: string
): { regex: RegExp | null; error: string | null } {
  try {
    const regex = new RegExp(pattern, flags)
    return { regex, error: null }
  } catch (err) {
    return {
      regex: null,
      error: err instanceof Error ? err.message : 'Invalid regular expression',
    }
  }
}

export function executeRegex(
  pattern: string,
  flags: string,
  testString: string
): RegexResult {
  if (!pattern) {
    return { matches: [], error: null }
  }

  const { regex, error } = buildRegex(pattern, flags)

  if (error || !regex) {
    return { matches: [], error }
  }

  if (!testString) {
    return { matches: [], error: null }
  }

  const matches: RegexMatch[] = []

  if (flags.includes('g')) {
    let match: RegExpExecArray | null
    let safety = 0
    const maxIterations = 10000

    while ((match = regex.exec(testString)) !== null && safety < maxIterations) {
      matches.push({
        fullMatch: match[0],
        index: match.index,
        endIndex: match.index + match[0].length,
        groups: match.groups ? { ...match.groups } : {},
        captures: match.slice(1),
      })

      if (match.index === regex.lastIndex) {
        regex.lastIndex++
      }

      safety++
    }
  } else {
    const match = regex.exec(testString)
    if (match) {
      matches.push({
        fullMatch: match[0],
        index: match.index,
        endIndex: match.index + match[0].length,
        groups: match.groups ? { ...match.groups } : {},
        captures: match.slice(1),
      })
    }
  }

  return { matches, error: null }
}
