import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Helper: CPF Validation
const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/[^\d]/g, '')
    if (cleanCPF.length !== 11) return false
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false // Elimina CPFs com todos digitos iguais

    let sum = 0
    let remainder

    for (let i = 1; i <= 9; i++) {
        sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false

    sum = 0
    for (let i = 1; i <= 10; i++) {
        sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (12 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false

    return true
}

// Helper: CNPJ Validation
const validateCNPJ = (cnpj: string): boolean => {
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '')
    if (cleanCNPJ.length !== 14) return false
    if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false

    let size = cleanCNPJ.length - 2
    let numbers = cleanCNPJ.substring(0, size)
    const digits = cleanCNPJ.substring(size)
    let sum = 0
    let pos = size - 7

    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--
        if (pos < 2) pos = 9
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (result !== parseInt(digits.charAt(0))) return false

    size = size + 1
    numbers = cleanCNPJ.substring(0, size)
    sum = 0
    pos = size - 7
    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--
        if (pos < 2) pos = 9
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (result !== parseInt(digits.charAt(1))) return false

    return true
}

// Helper: Email Validation
const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
}

// Helper: Credit Card Validation (Luhn algorithm)
const validateCreditCard = (cardNumber: string): boolean => {
    const cleanCard = cardNumber.replace(/[^\d]/g, '')
    if (cleanCard.length < 13 || cleanCard.length > 19) return false

    let sum = 0
    let shouldDouble = false

    for (let i = cleanCard.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanCard.charAt(i))

        if (shouldDouble) {
            if ((digit *= 2) > 9) digit -= 9
        }

        sum += digit
        shouldDouble = !shouldDouble
    }

    return sum % 10 === 0
}

export function Validators() {
    const [cpf, setCpf] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [email, setEmail] = useState('')
    const [creditCard, setCreditCard] = useState('')

    const getValidationStyle = (value: string, isValid: boolean) => {
        if (!value) return ''
        return isValid
            ? 'border-green-500 focus-visible:ring-green-500'
            : 'border-red-500 focus-visible:ring-red-500'
    }

    const getValidationMessage = (value: string, isValid: boolean) => {
        if (!value) return null
        return isValid ? (
            <span className="text-sm text-green-600 dark:text-green-400">Valid</span>
        ) : (
            <span className="text-sm text-red-600 dark:text-red-400">Invalid</span>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Data Validators</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Quickly validate common formats and documents like CPF, CNPJ, Email, and Credit Cards.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* CPF Validator */}
                <Card className="p-6">
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">CPF Validator</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Assesses format and mathematically verifies CPF check digits.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="cpf-input">CPF Document</Label>
                                {getValidationMessage(cpf, validateCPF(cpf))}
                            </div>
                            <Input
                                id="cpf-input"
                                type="text"
                                placeholder="000.000.000-00 or numbers only"
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                className={getValidationStyle(cpf, validateCPF(cpf))}
                            />
                        </div>
                    </div>
                </Card>

                {/* CNPJ Validator */}
                <Card className="p-6">
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">CNPJ Validator</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Assesses format and mathematically verifies CNPJ check digits.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="cnpj-input">CNPJ Document</Label>
                                {getValidationMessage(cnpj, validateCNPJ(cnpj))}
                            </div>
                            <Input
                                id="cnpj-input"
                                type="text"
                                placeholder="00.000.000/0000-00 or numbers only"
                                value={cnpj}
                                onChange={(e) => setCnpj(e.target.value)}
                                className={getValidationStyle(cnpj, validateCNPJ(cnpj))}
                            />
                        </div>
                    </div>
                </Card>

                {/* Email Validator */}
                <Card className="p-6">
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Email Validator</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Checks if the email string adheres to common email string layout.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="email-input">Email Address</Label>
                                {getValidationMessage(email, validateEmail(email))}
                            </div>
                            <Input
                                id="email-input"
                                type="email"
                                placeholder="example@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={getValidationStyle(email, validateEmail(email))}
                            />
                        </div>
                    </div>
                </Card>

                {/* Credit Card Validator */}
                <Card className="p-6">
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Credit Card Validator</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Verifies credit card using the Luhn algorithm (modulus 10).
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="cc-input">Credit Card Number</Label>
                                {getValidationMessage(creditCard, validateCreditCard(creditCard))}
                            </div>
                            <Input
                                id="cc-input"
                                type="text"
                                placeholder="0000 0000 0000 0000"
                                value={creditCard}
                                onChange={(e) => setCreditCard(e.target.value)}
                                className={getValidationStyle(creditCard, validateCreditCard(creditCard))}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
