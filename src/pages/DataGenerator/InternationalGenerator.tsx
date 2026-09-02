import { useMemo, useState } from 'react'
import { BadgeCheck, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { GeneratorCard } from './GeneratorCard'
import {
  INTERNATIONAL_COUNTRIES,
  generateInternationalDocument,
  generateInternationalPhone,
  generateInternationalPostalCode,
  type InternationalCountryCode,
} from '@/utils/generators/internationalGenerator'
import { useLanguage } from '@/i18n/LanguageContext'

const selectClassName = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

export function InternationalGenerator() {
  const { locale, t } = useLanguage()
  const [countryCode, setCountryCode] = useState<InternationalCountryCode>('AR')
  const [documentId, setDocumentId] = useState('dni')
  const [formatted, setFormatted] = useState(true)
  const [document, setDocument] = useState('')
  const [phone, setPhone] = useState('')
  const [postalCode, setPostalCode] = useState('')

  const country = useMemo(
    () => INTERNATIONAL_COUNTRIES.find(({ code }) => code === countryCode) ?? INTERNATIONAL_COUNTRIES[0],
    [countryCode]
  )
  const selectedDocument = country.documents.find(({ id }) => id === documentId) ?? country.documents[0]
  const countryNames = useMemo(() => new Intl.DisplayNames([locale], { type: 'region' }), [locale])

  const handleCountryChange = (value: string) => {
    const nextCode = value as InternationalCountryCode
    const nextCountry = INTERNATIONAL_COUNTRIES.find(({ code }) => code === nextCode) ?? INTERNATIONAL_COUNTRIES[0]
    setCountryCode(nextCode)
    setDocumentId(nextCountry.documents[0].id)
    setDocument('')
    setPhone('')
    setPostalCode('')
  }

  const generateDocument = () =>
    setDocument(generateInternationalDocument(countryCode, selectedDocument.id, formatted))
  const generatePhone = () => setPhone(generateInternationalPhone(countryCode))
  const generatePostalCode = () =>
    setPostalCode(generateInternationalPostalCode(countryCode, formatted))

  const generateAll = () => {
    generateDocument()
    generatePhone()
    generatePostalCode()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="international-country">{t('generator.country')}</Label>
          <select
            id="international-country"
            className={selectClassName}
            value={countryCode}
            onChange={(event) => handleCountryChange(event.target.value)}
          >
            {INTERNATIONAL_COUNTRIES.map((item) => (
              <option key={item.code} value={item.code}>
                {countryNames.of(item.code) ?? item.name} (+{item.callingCode})
              </option>
            ))}
          </select>
        </div>

        {country.documents.length > 1 && (
          <div className="flex-1 space-y-2">
            <Label htmlFor="international-document-type">{t('generator.documentType')}</Label>
            <select
              id="international-document-type"
              className={selectClassName}
              value={selectedDocument.id}
              onChange={(event) => {
                setDocumentId(event.target.value)
                setDocument('')
              }}
            >
              {country.documents.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex h-10 items-center gap-2 sm:px-2">
          <Checkbox
            id="international-format"
            checked={formatted}
            onCheckedChange={(checked) => setFormatted(checked === true)}
          />
          <Label htmlFor="international-format" className="cursor-pointer font-normal text-muted-foreground">
            {t('generator.formatted')}
          </Label>
        </div>

        <Button size="lg" onClick={generateAll} className="shrink-0">
          {t('generator.generateAll')}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">{t('generator.internationalHint')}</p>

      <div className="grid gap-6 sm:grid-cols-2">
        <GeneratorCard
          title={`${t('generator.document')} · ${selectedDocument.label}`}
          value={document}
          onGenerate={generateDocument}
          icon={<BadgeCheck />}
        />
        <GeneratorCard
          title={`${t('generator.phone')} · +${country.callingCode}`}
          value={phone}
          onGenerate={generatePhone}
          icon={<Phone />}
        />
        <div className="sm:col-span-2">
          <GeneratorCard
            title={t('generator.postalCode')}
            value={postalCode}
            onGenerate={generatePostalCode}
            icon={<MapPin />}
          />
        </div>
      </div>
    </div>
  )
}
