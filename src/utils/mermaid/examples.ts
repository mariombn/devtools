export interface MermaidExample {
  id: string
  /** Diagram-type name — mermaid terminology, intentionally not translated. */
  label: string
  code: string
}

export const mermaidExamples: MermaidExample[] = [
  {
    id: 'flowchart',
    label: 'Flowchart',
    code: `flowchart TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Ship it]
    B -- No --> D[Debug]
    D --> B
    C --> E[Done]`,
  },
  {
    id: 'sequence',
    label: 'Sequence',
    code: `sequenceDiagram
    participant U as User
    participant A as API
    participant D as Database
    U->>A: POST /login
    A->>D: SELECT user
    D-->>A: user row
    A-->>U: 200 + token`,
  },
  {
    id: 'class',
    label: 'Class',
    code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +fetch()
    }
    class Cat {
        +scratch()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
  },
  {
    id: 'state',
    label: 'State',
    code: `stateDiagram-v2
    [*] --> Idle
    Idle --> Loading: fetch
    Loading --> Success: 200
    Loading --> Error: 4xx / 5xx
    Success --> Idle: reset
    Error --> Loading: retry
    Success --> [*]`,
  },
  {
    id: 'er',
    label: 'ER',
    code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : "listed in"
    CUSTOMER {
        int id
        string name
        string email
    }
    ORDER {
        int id
        date created_at
        string status
    }`,
  },
  {
    id: 'gantt',
    label: 'Gantt',
    code: `gantt
    title Project schedule
    dateFormat YYYY-MM-DD
    axisFormat %d/%m
    section Discovery
    Requirements   :done,   req, 2026-01-05, 5d
    Design         :active, des, 2026-01-12, 7d
    section Build
    Implementation :        dev, after des, 14d
    QA             :        qa,  after dev, 5d`,
  },
  {
    id: 'pie',
    label: 'Pie',
    code: `pie title Traffic by source
    "Organic" : 45
    "Direct" : 25
    "Referral" : 18
    "Social" : 12`,
  },
  {
    id: 'mindmap',
    label: 'Mindmap',
    code: `mindmap
  root((DevTools))
    Data
      JSON
      SQL
      Validators
    Text
      Diff
      Regex
      Markdown
    Security
      Bcrypt
      Crypto`,
  },
  {
    id: 'git',
    label: 'Git graph',
    code: `gitGraph
    commit id: "init"
    branch feature
    checkout feature
    commit id: "add page"
    commit id: "add tests"
    checkout main
    merge feature
    commit id: "release"`,
  },
]

export const defaultMermaidCode = mermaidExamples[0].code
