export interface CommonPattern {
  name: string
  pattern: string
  flags: string
  description: string
  example: string
}

export const commonPatterns: CommonPattern[] = [
  {
    name: 'Email',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    flags: 'g',
    description: 'Match email addresses',
    example: 'Contact us at user@example.com or admin@test.org',
  },
  {
    name: 'URL',
    pattern: 'https?://[^\\s/$.?#][^\\s]*',
    flags: 'g',
    description: 'Match HTTP/HTTPS URLs',
    example: 'Visit https://example.com or http://test.org/path?q=1',
  },
  {
    name: 'IPv4',
    pattern: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b',
    flags: 'g',
    description: 'Match IPv4 addresses',
    example: 'Server at 192.168.1.1 and gateway 10.0.0.1',
  },
  {
    name: 'Phone (BR)',
    pattern: '\\(?\\d{2}\\)?\\s?\\d{4,5}-?\\d{4}',
    flags: 'g',
    description: 'Match Brazilian phone numbers',
    example: 'Call (11) 98765-4321 or (21) 3456-7890',
  },
  {
    name: 'Date (YYYY-MM-DD)',
    pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])',
    flags: 'g',
    description: 'Match ISO date format',
    example: 'Created on 2026-03-24 and updated 2026-01-15',
  },
  {
    name: 'Date (DD/MM/YYYY)',
    pattern: '(?:0[1-9]|[12]\\d|3[01])/(?:0[1-9]|1[0-2])/\\d{4}',
    flags: 'g',
    description: 'Match Brazilian date format',
    example: 'Nascido em 24/03/2026 e atualizado 15/01/2026',
  },
  {
    name: 'Time (HH:MM:SS)',
    pattern: '(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d',
    flags: 'g',
    description: 'Match 24-hour time format',
    example: 'Started at 14:30:00 and ended at 18:45:30',
  },
  {
    name: 'Hex Color',
    pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
    flags: 'g',
    description: 'Match hex color codes',
    example: 'Colors: #ff6600 #333 #1a2b3c',
  },
  {
    name: 'UUID',
    pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}',
    flags: 'g',
    description: 'Match UUID v4 format',
    example: 'ID: 550e8400-e29b-41d4-a716-446655440000',
  },
  {
    name: 'HTML Tag',
    pattern: '<([a-z][a-z0-9]*)\\b[^>]*>',
    flags: 'gi',
    description: 'Match opening HTML tags',
    example: '<div class="test"><span>hello</span></div>',
  },
  {
    name: 'CPF',
    pattern: '\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}',
    flags: 'g',
    description: 'Match CPF numbers (with or without formatting)',
    example: 'CPF: 123.456.789-09 or 12345678909',
  },
  {
    name: 'CNPJ',
    pattern: '\\d{2}\\.?\\d{3}\\.?\\d{3}/?\\d{4}-?\\d{2}',
    flags: 'g',
    description: 'Match CNPJ numbers (with or without formatting)',
    example: 'CNPJ: 12.345.678/0001-90 or 12345678000190',
  },
  {
    name: 'CEP',
    pattern: '\\d{5}-?\\d{3}',
    flags: 'g',
    description: 'Match Brazilian postal codes',
    example: 'CEP: 01001-000 or 12345678',
  },
  {
    name: 'Credit Card',
    pattern: '\\b\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}\\b',
    flags: 'g',
    description: 'Match credit card numbers',
    example: 'Card: 4111-1111-1111-1111 or 4111 1111 1111 1111',
  },
]
