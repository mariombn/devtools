import { useState } from 'react'
import {
  BadgeCheck,
  Building2,
  Phone,
  MapPin,
  User,
  Mail,
  Lock,
} from 'lucide-react'
import { PageTitle } from '@/components/Common/PageTitle'
import { GeneratorCard } from './GeneratorCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { generateCPF } from '@/utils/generators/cpfGenerator'
import { generateCNPJ } from '@/utils/generators/cnpjGenerator'
import { generatePhone } from '@/utils/generators/phoneGenerator'
import type { PhoneType } from '@/utils/generators/phoneGenerator'
import { generateCEP } from '@/utils/generators/cepGenerator'
import { generateName } from '@/utils/generators/nameGenerator'
import { generateEmail } from '@/utils/generators/emailGenerator'
import { generatePassword } from '@/utils/generators/passwordGenerator'

export function DataGenerator() {
  const [cpf, setCpf] = useState('')
  const [cpfFormatted, setCpfFormatted] = useState(true)

  const [cnpj, setCnpj] = useState('')
  const [cnpjFormatted, setCnpjFormatted] = useState(true)

  const [phone, setPhone] = useState('')
  const [phoneType, setPhoneType] = useState<PhoneType>('mobile')
  const [phoneWithDDD, setPhoneWithDDD] = useState(true)
  const [phoneFormatted, setPhoneFormatted] = useState(true)

  const [cep, setCep] = useState('')
  const [cepFormatted, setCepFormatted] = useState(true)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')
  const [passwordLength, setPasswordLength] = useState(12)
  const [passwordOptions, setPasswordOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true,
  })

  const handleGenerateCpf = () => setCpf(generateCPF(cpfFormatted))
  const handleGenerateCnpj = () => setCnpj(generateCNPJ(cnpjFormatted))
  const handleGeneratePhone = () =>
    setPhone(
      generatePhone({
        type: phoneType,
        withDDD: phoneWithDDD,
        formatted: phoneFormatted,
      })
    )
  const handleGenerateCep = () => setCep(generateCEP(cepFormatted))
  const handleGenerateName = () => {
    const newName = generateName()
    setName(newName)
    setEmail(generateEmail(newName))
  }
  const handleGenerateEmail = () => setEmail(generateEmail())
  const handleGeneratePassword = () =>
    setPassword(
      generatePassword({ length: passwordLength, ...passwordOptions })
    )

  const handleGenerateAll = () => {
    handleGenerateCpf()
    handleGenerateCnpj()
    handleGeneratePhone()
    handleGenerateCep()
    handleGenerateName()
    handleGeneratePassword()
  }

  const checkboxLabel = (id: string, label: string) => (
    <Label
      htmlFor={id}
      className="cursor-pointer text-sm font-normal text-muted-foreground"
    >
      {label}
    </Label>
  )

  return (
    <div>
      <div className="flex justify-between items-start">

        <PageTitle description="Generate CPF, CNPJ, phone, CEP, names, emails, and passwords.">Data Generator</PageTitle>
        <Button size="lg" onClick={handleGenerateAll} className="shrink-0">
          Generate All
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* CPF */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex-1 text-sm font-semibold">
              CPF
            </span>
            <div className="flex items-center gap-2">
              <Checkbox
                id="cpf-format"
                checked={cpfFormatted}
                onCheckedChange={(checked) =>
                  setCpfFormatted(checked === true)
                }
              />
              {checkboxLabel('cpf-format', 'Formatted')}
            </div>
          </div>
          <GeneratorCard
            title=""
            value={cpf}
            onGenerate={handleGenerateCpf}
            icon={<BadgeCheck />}
          />
        </div>

        {/* CNPJ */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex-1 text-sm font-semibold">
              CNPJ
            </span>
            <div className="flex items-center gap-2">
              <Checkbox
                id="cnpj-format"
                checked={cnpjFormatted}
                onCheckedChange={(checked) =>
                  setCnpjFormatted(checked === true)
                }
              />
              {checkboxLabel('cnpj-format', 'Formatted')}
            </div>
          </div>
          <GeneratorCard
            title=""
            value={cnpj}
            onGenerate={handleGenerateCnpj}
            icon={<Building2 />}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex-1 text-sm font-semibold">
              Phone
            </span>
            <div className="flex items-center gap-2">
              <Checkbox
                id="phone-mobile"
                checked={phoneType === 'mobile'}
                onCheckedChange={(checked) =>
                  setPhoneType(checked ? 'mobile' : 'landline')
                }
              />
              {checkboxLabel('phone-mobile', 'Mobile')}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="phone-ddd"
                checked={phoneWithDDD}
                onCheckedChange={(checked) =>
                  setPhoneWithDDD(checked === true)
                }
              />
              {checkboxLabel('phone-ddd', 'DDD')}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="phone-format"
                checked={phoneFormatted}
                onCheckedChange={(checked) =>
                  setPhoneFormatted(checked === true)
                }
              />
              {checkboxLabel('phone-format', 'Format')}
            </div>
          </div>
          <GeneratorCard
            title=""
            value={phone}
            onGenerate={handleGeneratePhone}
            icon={<Phone />}
          />
        </div>

        {/* CEP */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex-1 text-sm font-semibold">
              CEP
            </span>
            <div className="flex items-center gap-2">
              <Checkbox
                id="cep-format"
                checked={cepFormatted}
                onCheckedChange={(checked) =>
                  setCepFormatted(checked === true)
                }
              />
              {checkboxLabel('cep-format', 'Formatted')}
            </div>
          </div>
          <GeneratorCard
            title=""
            value={cep}
            onGenerate={handleGenerateCep}
            icon={<MapPin />}
          />
        </div>

        {/* Name */}
        <GeneratorCard
          title="Name"
          value={name}
          onGenerate={handleGenerateName}
          icon={<User />}
        />

        {/* Email */}
        <GeneratorCard
          title="Email"
          value={email}
          onGenerate={handleGenerateEmail}
          icon={<Mail />}
        />

        {/* Password */}
        <div className="space-y-2 sm:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-sm font-medium text-muted-foreground">
              Password
            </span>
            <Input
              type="number"
              min={4}
              max={64}
              value={passwordLength}
              onChange={(e) => setPasswordLength(Number(e.target.value))}
              className="h-8 w-20 font-mono"
            />
            <div className="flex items-center gap-2">
              <Checkbox
                id="pw-upper"
                checked={passwordOptions.uppercase}
                onCheckedChange={(checked) =>
                  setPasswordOptions({
                    ...passwordOptions,
                    uppercase: checked === true,
                  })
                }
              />
              {checkboxLabel('pw-upper', 'A-Z')}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="pw-lower"
                checked={passwordOptions.lowercase}
                onCheckedChange={(checked) =>
                  setPasswordOptions({
                    ...passwordOptions,
                    lowercase: checked === true,
                  })
                }
              />
              {checkboxLabel('pw-lower', 'a-z')}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="pw-num"
                checked={passwordOptions.numbers}
                onCheckedChange={(checked) =>
                  setPasswordOptions({
                    ...passwordOptions,
                    numbers: checked === true,
                  })
                }
              />
              {checkboxLabel('pw-num', '0-9')}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="pw-special"
                checked={passwordOptions.special}
                onCheckedChange={(checked) =>
                  setPasswordOptions({
                    ...passwordOptions,
                    special: checked === true,
                  })
                }
              />
              {checkboxLabel('pw-special', '!@#$')}
            </div>
          </div>
          <GeneratorCard
            title=""
            value={password}
            onGenerate={handleGeneratePassword}
            icon={<Lock />}
          />
        </div>
      </div>
    </div>
  )
}
