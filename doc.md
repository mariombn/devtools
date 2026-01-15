Aqui está a especificação técnica completa para o desenvolvimento da sua aplicação **DevTools**.

### 1. Visão Geral do Projeto

Uma Single Page Application (SPA) focada em utilitários para desenvolvedores. O objetivo é ser leve, rápido e rodar inteiramente no *client-side* (navegador), sem necessidade de backend.

### 2. Stack Tecnológica

* **Core:** React 18+
* **Linguagem:** TypeScript
* **Build Tool:** Vite
* **UI Framework:** Material UI (MUI) v5+
* **Roteamento:** React Router DOM (v6)
* **Ícones:** Material Icons
* **Gerenciamento de Estado:** React Context API (para tema e configurações globais) e Local State (para as ferramentas).

### 3. Estrutura de Navegação (Layout)

O layout será do tipo **Dashboard** com uma Sidebar persistente (App Drawer).

* **Sidebar:** Menu lateral contendo ícones e nomes das ferramentas.
* **Header:** Título da ferramenta atual e Toggle de Tema (Dark/Light Mode).
* **Main Content:** Área onde a ferramenta selecionada é renderizada.

---

### 4. Especificação Funcional das Ferramentas

#### 4.1. JSON Toolkit (Validador & Formatador)

Uma interface unificada para validação e manipulação de JSON.

* **Layout:**
* Duas áreas de texto (Input e Output) ou uma área única com botões de ação (dependendo da preferência de UX, sugiro **Split View** opcional).
* **Input:** `TextField` multiline (full width).


* **Funcionalidades:**
* **Validate:** Ao digitar ou colar, verifica se o JSON é válido. Se inválido, exibe mensagem de erro indicando a linha/posição (se possível).
* **Prettify:** Formata o JSON com indentação de 2 ou 4 espaços.
* **Minify:** Remove todos os espaços e quebras de linha.
* **Copy:** Botão para copiar o resultado para a área de transferência.
* **Clear:** Limpa o editor.


* **Bibliotecas sugeridas:** `JSON.parse` / `JSON.stringify` nativos são suficientes.

#### 4.2. Data Generator (Gerador de Dados)

Gera dados fictícios mas válidos (algoritmicamente) para testes.

* **Layout:**
* Um Grid de *Cards*, onde cada Card representa um tipo de dado.
* Botão flutuante ou fixo "Generate All".


* **Campos Requeridos:**
* **CPF:** Deve passar no cálculo de dígito verificador. Opção: *Com/Sem Pontuação*.
* **CNPJ:** Deve passar no cálculo de dígito verificador. Opção: *Com/Sem Pontuação*.
* **Telefone:** Opções: *Fixo*, *Celular*, *Com DDD*, *Sem DDD*.
* **CEP:** Formato `00000-000`.
* **Nome:** Gerar nomes aleatórios (Primeiro nome + Sobrenome).
* **Email:** Baseado no nome gerado (ex: `nome.sobrenome@example.com`).
* **Senha:** Input para definir tamanho e complexidade (Alpha, Numérico, Especial).


* **Interação:**
* Ao clicar no ícone de cópia ao lado do dado, copia para o clipboard.


* **Bibliotecas sugeridas:**
* `faker-js` (ou `@faker-js/faker`) para nomes/emails.
* Implementação própria de algoritmos Modulo 11 para CPF/CNPJ (mais leve que importar libs pesadas).



#### 4.3. Text Comparator (Diff Viewer)

Ferramenta para comparar duas strings.

* **Layout:**
* Dois painéis de entrada: **Original Text** (Esquerda) e **Modified Text** (Direita).
* Um painel de visualização do Diff abaixo (ou substituindo os inputs após processar).


* **Funcionalidades:**
* **Split View:** Mostra lado a lado as diferenças.
* **Unified View:** Mostra em uma única coluna com linhas vermelhas (-) e verdes (+).
* Highlight de sintaxe básico (opcional).


* **Bibliotecas sugeridas:**
* `react-diff-viewer-continued` (Fork mantido do react-diff-viewer). É leve e integra bem com React.



---

### 5. Estrutura de Diretórios Sugerida

```text
src/
├── assets/
├── components/
│   ├── Layout/
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── MainLayout.tsx
│   ├── Common/
│   │   ├── CopyButton.tsx
│   │   └── PageTitle.tsx
├── pages/
│   ├── JsonTools/
│   │   └── index.tsx
│   ├── DataGenerator/
│   │   ├── index.tsx
│   │   └── GeneratorCard.tsx
│   └── TextDiff/
│       └── index.tsx
├── utils/
│   ├── generators/
│   │   ├── cpfGenerator.ts
│   │   ├── cnpjGenerator.ts
│   │   └── passwordGenerator.ts
│   ├── formatters/
│   │   └── jsonFormatter.ts
│   └── validators/
├── hooks/
│   └── useClipboard.ts
├── theme/
│   └── theme.ts (MUI Customization)
├── App.tsx
└── main.tsx

```

### 6. Definição de Rotas

| Rota | Componente | Descrição |
| --- | --- | --- |
| `/` | `Dashboard` ou `JsonTools` | Redireciona para a primeira ferramenta ou mostra home. |
| `/json` | `JsonToolkit` | Validador e Formatador. |
| `/generator` | `DataGenerator` | Gerador de dados brasileiros. |
| `/diff` | `TextDiff` | Comparador de textos. |

### 7. Requisitos Não Funcionais

1. **Persistência Local:** Usar `localStorage` para salvar o último input do usuário no JSON Tool e Diff Tool (opcional, mas melhora a UX para evitar perda de dados acidental).
2. **Responsividade:** A Sidebar deve se comportar como um Drawer temporário (hambúrguer) em telas menores que `md` (mobile/tablet).
3. **Performance:** Utilizar `React.memo` nos componentes de input de texto para evitar re-renderização lenta em strings muito grandes.

### 8. Próximo Passo

Gostaria que eu gerasse a configuração inicial do projeto (package.json + vite config) ou prefere que eu comece codando os utilitários de geração de CPF/CNPJ (`utils/generators`)?