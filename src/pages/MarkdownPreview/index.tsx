import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { PageTitle } from '@/components/Common/PageTitle'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const defaultMarkdown = `# Markdown Preview

Escreva seu markdown aqui e veja a renderização em tempo real!

## Recursos suportados

### Formatação de texto
- **Negrito** e *itálico*
- ~~Tachado~~
- \`código inline\`

### Listas

**Lista não ordenada:**
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

**Lista ordenada:**
1. Primeiro item
2. Segundo item
3. Terceiro item

### Links e imagens
[Link para o GitHub](https://github.com)

### Código

\`\`\`javascript
function hello(name) {
  console.log(\`Hello, \${name}!\`)
}
\`\`\`

### Tabelas

| Coluna 1 | Coluna 2 | Coluna 3 |
|----------|----------|----------|
| Dado 1   | Dado 2   | Dado 3   |
| Dado 4   | Dado 5   | Dado 6   |

### Citação

> Esta é uma citação.
> Pode ter várias linhas.

### Linha horizontal

---

**Comece a editar para ver suas próprias mudanças!**
`

export function MarkdownPreview() {
  const [markdown, setMarkdown] = useLocalStorage('markdown-input', defaultMarkdown)
  const isDark = document.documentElement.classList.contains('dark')

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <PageTitle>Markdown Preview</PageTitle>
      
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Editor */}
        <Card className="flex w-1/2 flex-col overflow-hidden">
          <CardContent className="flex flex-1 flex-col gap-3 p-6">
            <h3 className="text-base font-semibold text-foreground">Editor</h3>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Digite seu markdown aqui..."
              className="flex-1 resize-none font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="flex w-1/2 flex-col overflow-hidden">
          <CardContent className="flex flex-1 flex-col gap-3 p-6">
            <h3 className="text-base font-semibold text-foreground">Preview</h3>
            <div className="flex-1 overflow-auto rounded-lg border border-border bg-background p-8">
              <div className="markdown-preview">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      const language = match ? match[1] : ''
                      
                      return !inline && language ? (
                        <SyntaxHighlighter
                          style={isDark ? (vscDarkPlus as never) : (vs as never)}
                          language={language}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            padding: '1em',
                            fontSize: '0.875em',
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
