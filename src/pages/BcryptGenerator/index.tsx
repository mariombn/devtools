import { useState } from 'react'
import { PageTitle } from '@/components/Common/PageTitle'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import bcrypt from 'bcryptjs'
import { useLanguage } from '@/i18n/LanguageContext'

export function BcryptGenerator() {
  const { t } = useLanguage()
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
    if (rounds < 10) return t('bcrypt.roundsLow')
    if (rounds < 12) return t('bcrypt.roundsMedium')
    if (rounds <= 14) return t('bcrypt.roundsHigh')
    return t('bcrypt.roundsVeryHigh')
  }

  return (
    <div className="flex flex-col gap-6">
      <PageTitle description={t('bcrypt.description')}>
        {t('bcrypt.title')}
      </PageTitle>

      {/* Generate Hash Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{t('bcrypt.generateHash')}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('bcrypt.generateHashDesc')}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-to-hash">{t('bcrypt.textToHash')}</Label>
              <Input
                id="text-to-hash"
                type="password"
                placeholder={t('bcrypt.textPlaceholder')}
                value={textToHash}
                onChange={(e) => setTextToHash(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="rounds">{t('bcrypt.roundsLabel', { rounds })}</Label>
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
              {isGenerating ? t('bcrypt.generating') : t('bcrypt.generateHash')}
            </Button>

            {generatedHash && (
              <div className="space-y-2">
                <Label htmlFor="generated-hash">{t('bcrypt.generatedHash')}</Label>
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
            <h2 className="text-lg font-semibold text-foreground">{t('bcrypt.verifyHash')}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('bcrypt.verifyHashDesc')}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hash-to-verify">{t('bcrypt.bcryptHash')}</Label>
              <Textarea
                id="hash-to-verify"
                placeholder={t('bcrypt.hashPlaceholder')}
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
              <Label htmlFor="original-text">{t('bcrypt.originalText')}</Label>
              <Input
                id="original-text"
                type="password"
                placeholder={t('bcrypt.originalPlaceholder')}
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
              {isVerifying ? t('bcrypt.verifying') : t('bcrypt.verifyHash')}
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
                  {verificationResult ? t('bcrypt.hashMatches') : t('bcrypt.hashNoMatch')}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* FAQ Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">{t('bcrypt.faq')}</h2>

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-foreground">{t('bcrypt.faqQ1')}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('bcrypt.faqA1')}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground">{t('bcrypt.faqQ2')}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('bcrypt.faqA2')}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground">{t('bcrypt.faqQ3')}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('bcrypt.faqA3')}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground">{t('bcrypt.faqQ4')}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('bcrypt.faqA4')}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
