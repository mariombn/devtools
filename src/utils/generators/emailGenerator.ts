export function generateEmail(baseName?: string): string {
  const domains = ['example.com', 'test.com', 'email.com', 'mail.com', 'demo.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];

  if (baseName) {
    // Converte nome em formato de email
    const emailName = baseName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/\s+/g, '.')
      .replace(/[^a-z0-9.]/g, '');
    return `${emailName}@${domain}`;
  }

  // Gera email aleatório
  const randomName = Math.random().toString(36).substring(2, 10);
  return `${randomName}@${domain}`;
}
