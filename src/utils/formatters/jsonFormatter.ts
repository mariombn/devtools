export interface JsonValidationResult {
  valid: boolean;
  error?: string;
  errorPosition?: { line: number; column: number };
}

export function validateJson(text: string): JsonValidationResult {
  if (!text.trim()) {
    return { valid: false, error: 'Empty input' };
  }

  try {
    JSON.parse(text);
    return { valid: true };
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Tenta extrair linha e coluna do erro
      const match = error.message.match(/position (\d+)/);
      if (match) {
        const position = parseInt(match[1], 10);
        const lines = text.substring(0, position).split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;
        return {
          valid: false,
          error: error.message,
          errorPosition: { line, column },
        };
      }
      return { valid: false, error: error.message };
    }
    return { valid: false, error: 'Unknown error' };
  }
}

export function prettifyJson(text: string, indent: number = 2): string {
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed, null, indent);
  } catch {
    throw new Error('Invalid JSON');
  }
}

export function minifyJson(text: string): string {
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed);
  } catch {
    throw new Error('Invalid JSON');
  }
}
