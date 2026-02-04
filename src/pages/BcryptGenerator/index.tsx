import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import bcrypt from 'bcryptjs'

export function BcryptGenerator() {
  // Generate Hash State
  const [textToHash, setTextToHash] = useState('')
  const [rounds, setRounds] = useState(12)
  const [generatedHash, setGeneratedHash] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // Verify Hash State
  const [hashToVerify, setHashToVerify] = useState('')
  const [originalText, setOriginalText] = useState('')
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const handleGenerateHash = async () => {
    if (!textToHash) {
      return
    }

    setIsGenerating(true)
    try {
      // Using setTimeout to allow UI to update
      setTimeout(async () => {
        const hash = await bcrypt.hash(textToHash, rounds)
        setGeneratedHash(hash)
        setIsGenerating(false)
      }, 50)
    } catch (error) {
      console.error('Error generating hash:', error)
      setIsGenerating(false)
    }
  }

  const handleVerifyHash = async () => {
    if (!hashToVerify || !originalText) {
      return
    }

    setIsVerifying(true)
    try {
      // Using setTimeout to allow UI to update
      setTimeout(async () => {
        const isMatch = await bcrypt.compare(originalText, hashToVerify)
        setVerificationResult(isMatch)
        setIsVerifying(false)
      }, 50)
    } catch (error) {
      console.error('Error verifying hash:', error)
      setVerificationResult(false)
      setIsVerifying(false)
    }
  }

  const getRoundsDescription = (rounds: number) => {
    if (rounds < 10) return 'Low security - for testing only'
    if (rounds < 12) return 'Medium security'
    if (rounds <= 14) return 'High security - suitable for production'
    return 'Very high security - slow processing'
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bcrypt Hash Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A simple tool to generate and verify bcrypt hashes. All processing happens in your browser for security.
        </p>
      </div>

      {/* Generate Hash Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Generate Hash</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate a bcrypt hash from your text. Higher rounds provide better security but take longer to process.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-to-hash">Text to Hash</Label>
              <Input
                id="text-to-hash"
                type="password"
                placeholder="Enter text to hash..."
                value={textToHash}
                onChange={(e) => setTextToHash(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="rounds">Rounds (Cost Factor): {rounds}</Label>
                <span className="text-xs text-muted-foreground">{getRoundsDescription(rounds)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRounds(Math.max(4, rounds - 1))}
                  disabled={rounds <= 4}
                >
                  -
                </Button>
                <input
                  id="rounds"
                  type="range"
                  min="4"
                  max="20"
                  value={rounds}
                  onChange={(e) => setRounds(Number(e.target.value))}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRounds(Math.min(20, rounds + 1))}
                  disabled={rounds >= 20}
                >
                  +
                </Button>
              </div>
            </div>

            <Button
              onClick={handleGenerateHash}
              disabled={!textToHash || isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : 'Generate Hash'}
            </Button>

            {generatedHash && (
              <div className="space-y-2">
                <Label htmlFor="generated-hash">Generated Hash</Label>
                <Textarea
                  id="generated-hash"
                  value={generatedHash}
                  readOnly
                  className="font-mono text-sm"
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Verify Hash Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Verify Hash</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Check if a bcrypt hash matches the original text.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hash-to-verify">Bcrypt Hash</Label>
              <Textarea
                id="hash-to-verify"
                placeholder="Enter bcrypt hash to verify..."
                value={hashToVerify}
                onChange={(e) => {
                  setHashToVerify(e.target.value)
                  setVerificationResult(null)
                }}
                className="font-mono text-sm"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="original-text">Original Text</Label>
              <Input
                id="original-text"
                type="password"
                placeholder="Enter original text..."
                value={originalText}
                onChange={(e) => {
                  setOriginalText(e.target.value)
                  setVerificationResult(null)
                }}
              />
            </div>

            <Button
              onClick={handleVerifyHash}
              disabled={!hashToVerify || !originalText || isVerifying}
              className="w-full"
            >
              {isVerifying ? 'Verifying...' : 'Verify Hash'}
            </Button>

            {verificationResult !== null && (
              <div
                className={`rounded-md border p-4 ${
                  verificationResult
                    ? 'border-green-500/50 bg-green-500/10'
                    : 'border-red-500/50 bg-red-500/10'
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    verificationResult ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {verificationResult ? '✓ Hash matches the original text!' : '✗ Hash does not match the original text'}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* FAQ Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">FAQ</h2>

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-foreground">What is bcrypt?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Bcrypt is a password hashing function designed to be computationally intensive. It's commonly used for
                securely storing passwords in databases.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground">How many rounds should I use?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                12 rounds is the recommended minimum for production use. More rounds increase security but also
                processing time. Choose based on your security requirements.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground">Is this tool secure?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                All processing happens in your browser using the bcryptjs library. No data is sent to any servers or
                stored anywhere.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground">Can I use this in production?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                This tool is primarily for testing and learning. For production use, implement bcrypt directly in your
                application using a trusted library.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
