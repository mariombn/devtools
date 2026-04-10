import { useState, useCallback } from 'react'
import CryptoJS from 'crypto-js'
import { PageTitle } from '@/components/Common/PageTitle'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Copy, Check, Lock, Unlock, RefreshCw, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types ────────────────────────────────────────────────────────────────────

type AlgorithmId =
  | 'base64'
  | 'md5'
  | 'sha1'
  | 'sha256'
  | 'sha384'
  | 'sha512'
  | 'sha3'
  | 'aes'
  | 'des'
  | 'tripledes'
  | 'rabbit'
  | 'rc4'

interface Algorithm {
  id: AlgorithmId
  label: string
  description: string
  requiresKey: boolean
  bidirectional: boolean // can decrypt
  category: 'symmetric' | 'hash' | 'encoding'
}

// ── Algorithm Definitions ────────────────────────────────────────────────────

const ALGORITHMS: Algorithm[] = [
  // Encoding
  {
    id: 'base64',
    label: 'Base64',
    description: 'Encode/decode binary data as ASCII text. Not encryption — encoding only.',
    requiresKey: false,
    bidirectional: true,
    category: 'encoding',
  },
  // Hashes (one-way)
  {
    id: 'md5',
    label: 'MD5',
    description: 'Produces a 128-bit hash. Deprecated for security — use SHA-256 or higher.',
    requiresKey: false,
    bidirectional: false,
    category: 'hash',
  },
  {
    id: 'sha1',
    label: 'SHA-1',
    description: 'Produces a 160-bit hash. Deprecated for cryptographic use.',
    requiresKey: false,
    bidirectional: false,
    category: 'hash',
  },
  {
    id: 'sha256',
    label: 'SHA-256',
    description: 'Part of SHA-2 family. Widely used for integrity verification and digital signatures.',
    requiresKey: false,
    bidirectional: false,
    category: 'hash',
  },
  {
    id: 'sha384',
    label: 'SHA-384',
    description: 'Stronger SHA-2 variant with a 384-bit output.',
    requiresKey: false,
    bidirectional: false,
    category: 'hash',
  },
  {
    id: 'sha512',
    label: 'SHA-512',
    description: 'Strongest SHA-2 variant providing 512-bit output.',
    requiresKey: false,
    bidirectional: false,
    category: 'hash',
  },
  {
    id: 'sha3',
    label: 'SHA-3 (256)',
    description: 'SHA-3 (Keccak) is the latest NIST hash standard, resistant to length-extension attacks.',
    requiresKey: false,
    bidirectional: false,
    category: 'hash',
  },
  // Symmetric Encryption
  {
    id: 'aes',
    label: 'AES',
    description: 'Advanced Encryption Standard — the current gold standard for symmetric encryption.',
    requiresKey: true,
    bidirectional: true,
    category: 'symmetric',
  },
  {
    id: 'des',
    label: 'DES',
    description: 'Data Encryption Standard — legacy cipher, 56-bit key. Do NOT use in production.',
    requiresKey: true,
    bidirectional: true,
    category: 'symmetric',
  },
  {
    id: 'tripledes',
    label: '3DES (Triple DES)',
    description: 'Applies DES three times. More secure than DES but slower; superseded by AES.',
    requiresKey: true,
    bidirectional: true,
    category: 'symmetric',
  },
  {
    id: 'rabbit',
    label: 'Rabbit',
    description: 'Fast stream cipher with 128-bit key. High performance for large data.',
    requiresKey: true,
    bidirectional: true,
    category: 'symmetric',
  },
  {
    id: 'rc4',
    label: 'RC4',
    description: 'Stream cipher — fast and simple but cryptographically broken. Avoid in production.',
    requiresKey: true,
    bidirectional: true,
    category: 'symmetric',
  },
]

const CATEGORY_LABELS: Record<Algorithm['category'], string> = {
  encoding: 'Encoding',
  hash: 'Hash Functions',
  symmetric: 'Symmetric Encryption',
}

const CATEGORY_COLORS: Record<Algorithm['category'], string> = {
  encoding: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  hash: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  symmetric: 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30',
}

// ── Crypto Engine ─────────────────────────────────────────────────────────────

function encrypt(algorithmId: AlgorithmId, text: string, key: string): string {
  switch (algorithmId) {
    case 'base64':
      return btoa(unescape(encodeURIComponent(text)))
    case 'md5':
      return CryptoJS.MD5(text).toString()
    case 'sha1':
      return CryptoJS.SHA1(text).toString()
    case 'sha256':
      return CryptoJS.SHA256(text).toString()
    case 'sha384':
      return CryptoJS.SHA384(text).toString()
    case 'sha512':
      return CryptoJS.SHA512(text).toString()
    case 'sha3':
      return CryptoJS.SHA3(text, { outputLength: 256 }).toString()
    case 'aes':
      return CryptoJS.AES.encrypt(text, key).toString()
    case 'des':
      return CryptoJS.DES.encrypt(text, key).toString()
    case 'tripledes':
      return CryptoJS.TripleDES.encrypt(text, key).toString()
    case 'rabbit':
      return CryptoJS.Rabbit.encrypt(text, key).toString()
    case 'rc4':
      return CryptoJS.RC4.encrypt(text, key).toString()
    default:
      throw new Error('Unknown algorithm')
  }
}

function decrypt(algorithmId: AlgorithmId, ciphertext: string, key: string): string {
  switch (algorithmId) {
    case 'base64':
      return decodeURIComponent(escape(atob(ciphertext)))
    case 'aes':
      return CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8)
    case 'des':
      return CryptoJS.DES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8)
    case 'tripledes':
      return CryptoJS.TripleDES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8)
    case 'rabbit':
      return CryptoJS.Rabbit.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8)
    case 'rc4':
      return CryptoJS.RC4.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8)
    default:
      throw new Error('Decrypt not supported for this algorithm')
  }
}

// ── Components ────────────────────────────────────────────────────────────────

interface CategoryBadgeProps {
  category: Algorithm['category']
}

function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        CATEGORY_COLORS[category]
      )}
    >
      {CATEGORY_LABELS[category]}
    </span>
  )
}

interface AlgorithmCardProps {
  algorithm: Algorithm
  isSelected: boolean
  onSelect: () => void
}

function AlgorithmCard({ algorithm, isSelected, onSelect }: AlgorithmCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full cursor-pointer rounded-lg border p-3 text-left transition-all duration-150',
        isSelected
          ? 'border-foreground/40 bg-secondary shadow-sm'
          : 'border-border hover:border-foreground/20 hover:bg-secondary/50'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold text-foreground leading-tight">{algorithm.label}</span>
        {isSelected && (
          <span className="mt-0.5 shrink-0 size-2 rounded-full bg-foreground" aria-hidden />
        )}
      </div>
      <div className="mt-1.5">
        <CategoryBadge category={algorithm.category} />
      </div>
    </button>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function CryptoToolkit() {
  const [selectedId, setSelectedId] = useState<AlgorithmId>('aes')
  const [inputText, setInputText] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [outputText, setOutputText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [lastAction, setLastAction] = useState<'encrypt' | 'decrypt' | null>(null)

  const selectedAlgo = ALGORITHMS.find((a) => a.id === selectedId)!

  const handleProcess = useCallback(
    (action: 'encrypt' | 'decrypt') => {
      setError(null)
      setOutputText('')
      try {
        const result =
          action === 'encrypt'
            ? encrypt(selectedId, inputText, secretKey)
            : decrypt(selectedId, inputText, secretKey)

        if (!result) throw new Error('Empty result — check your input and key.')
        setOutputText(result)
        setLastAction(action)
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unknown error occurred'
        setError(msg || 'An error occurred. Check your input and key.')
      }
    },
    [selectedId, inputText, secretKey]
  )

  const handleSwap = useCallback(() => {
    setInputText(outputText)
    setOutputText('')
    setError(null)
    setLastAction(null)
  }, [outputText])

  const handleCopy = useCallback(async () => {
    if (!outputText) return
    await navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [outputText])

  const handleClear = useCallback(() => {
    setInputText('')
    setOutputText('')
    setError(null)
    setLastAction(null)
  }, [])

  const handleSelectAlgorithm = useCallback((id: AlgorithmId) => {
    setSelectedId(id)
    setOutputText('')
    setError(null)
    setLastAction(null)
  }, [])

  const grouped = ALGORITHMS.reduce<Record<Algorithm['category'], Algorithm[]>>(
    (acc, algo) => {
      if (!acc[algo.category]) acc[algo.category] = []
      acc[algo.category].push(algo)
      return acc
    },
    {} as Record<Algorithm['category'], Algorithm[]>
  )

  const categoryOrder: Algorithm['category'][] = ['encoding', 'hash', 'symmetric']

  return (
    <div className="flex flex-col gap-6">
      <PageTitle description="Encrypt, decrypt, hash and encode values using the most popular cryptographic algorithms. All processing runs entirely in your browser.">
        Crypto Toolkit
      </PageTitle>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Algorithm Selector */}
        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <h2 className="mb-3 text-sm font-semibold text-foreground uppercase tracking-wider">
              Algorithms
            </h2>
            <div className="flex flex-col gap-4">
              {categoryOrder.map((category) => (
                <div key={category}>
                  <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {CATEGORY_LABELS[category]}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {grouped[category]?.map((algo) => (
                      <AlgorithmCard
                        key={algo.id}
                        algorithm={algo}
                        isSelected={selectedId === algo.id}
                        onSelect={() => handleSelectAlgorithm(algo.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Workspace */}
        <div className="flex flex-col gap-4">
          {/* Algorithm Info */}
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                <Info className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold text-foreground">{selectedAlgo.label}</h2>
                  <CategoryBadge category={selectedAlgo.category} />
                  {selectedAlgo.bidirectional ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                      <RefreshCw className="size-2.5" />
                      Reversible
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-600 dark:text-orange-400">
                      One-Way
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{selectedAlgo.description}</p>
              </div>
            </div>
          </Card>

          {/* Secret Key */}
          {selectedAlgo.requiresKey && (
            <Card className="p-4">
              <div className="space-y-2">
                <Label htmlFor="secret-key">Secret Key / Passphrase</Label>
                <Input
                  id="secret-key"
                  type="password"
                  placeholder="Enter your secret key..."
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Use a strong, unique key. The same key must be used for both encryption and decryption.
                </p>
              </div>
            </Card>
          )}

          {/* Input */}
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="input-text">Input</Label>
                <Button variant="ghost" size="sm" onClick={handleClear} className="h-7 text-xs text-muted-foreground">
                  Clear
                </Button>
              </div>
              <Textarea
                id="input-text"
                placeholder={
                  selectedAlgo.bidirectional
                    ? 'Enter text to encrypt or ciphertext to decrypt...'
                    : 'Enter text to hash...'
                }
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value)
                  setOutputText('')
                  setError(null)
                }}
                className="min-h-[120px] font-mono text-sm"
                rows={5}
              />
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleProcess('encrypt')}
              disabled={!inputText || (selectedAlgo.requiresKey && !secretKey)}
              className="flex-1 gap-2"
            >
              <Lock className="size-4" />
              {selectedAlgo.category === 'hash'
                ? 'Generate Hash'
                : selectedAlgo.category === 'encoding'
                  ? 'Encode'
                  : 'Encrypt'}
            </Button>

            {selectedAlgo.bidirectional && (
              <Button
                variant="outline"
                onClick={() => handleProcess('decrypt')}
                disabled={!inputText || (selectedAlgo.requiresKey && !secretKey)}
                className="flex-1 gap-2"
              >
                <Unlock className="size-4" />
                {selectedAlgo.category === 'encoding' ? 'Decode' : 'Decrypt'}
              </Button>
            )}
          </div>

          {/* Output */}
          {(outputText || error) && (
            <Card className={cn('p-4', error ? 'border-destructive/50' : '')}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>
                    {error
                      ? 'Error'
                      : lastAction === 'decrypt'
                        ? selectedAlgo.category === 'encoding'
                          ? 'Decoded Output'
                          : 'Decrypted Output'
                        : selectedAlgo.category === 'hash'
                          ? 'Hash Output'
                          : selectedAlgo.category === 'encoding'
                            ? 'Encoded Output'
                            : 'Encrypted Output'}
                  </Label>

                  {outputText && (
                    <div className="flex items-center gap-2">
                      {selectedAlgo.bidirectional && lastAction === 'encrypt' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSwap}
                          className="h-7 gap-1 text-xs text-muted-foreground"
                        >
                          <RefreshCw className="size-3" />
                          Use as Input
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="h-7 gap-1 text-xs"
                      >
                        {copied ? (
                          <>
                            <Check className="size-3 text-green-500" />
                            <span className="text-green-500">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {error ? (
                  <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                ) : (
                  <Textarea
                    id="output-text"
                    value={outputText}
                    readOnly
                    className="min-h-[100px] font-mono text-sm"
                    rows={5}
                  />
                )}
              </div>
            </Card>
          )}

          {/* Security Notice */}
          <Card className="border-amber-500/20 bg-amber-500/5 p-4">
            <div className="flex gap-3">
              <Info className="mt-0.5 size-4 shrink-0 text-amber-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Security Notice</p>
                <p className="text-xs text-muted-foreground">
                  All operations run entirely in your browser — no data is ever transmitted to any server.
                  Hash functions (MD5, SHA) are one-way and cannot be reversed. For production applications,
                  prefer AES-256 for symmetric encryption and SHA-256 or SHA-3 for hashing.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
