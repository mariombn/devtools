import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy, Plus, Minus } from 'lucide-react'
import {
    addDays, subDays, addWeeks, subWeeks, addMonths, subMonths,
    addBusinessDays, subBusinessDays, format, isValid
} from 'date-fns'

export function PeriodMath() {
    const [baseDate, setBaseDate] = useState<string>('')

    // Math operation
    const [operation, setOperation] = useState<'add' | 'subtract'>('add')
    const [unit, setUnit] = useState<'days' | 'weeks' | 'months'>('days')
    const [amount, setAmount] = useState<number>(0)

    // Options
    const [businessDaysOnly, setBusinessDaysOnly] = useState<boolean>(false)

    // Output
    const [resultDate, setResultDate] = useState<string>('-')
    const [resultFormatted, setResultFormatted] = useState<string>('-')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Current local time
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBaseDate(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
    }, [])

    const calculate = useCallback(() => {
        if (!baseDate) return

        const parsed = new Date(baseDate)
        if (!isValid(parsed)) {
            setError('Invalid base date')
            setResultDate('-')
            setResultFormatted('-')
            return
        }

        setError(null)

        // Safety check for large bounds
        let safeAmount = amount
        if (isNaN(amount)) safeAmount = 0
        // Prevent browser freezing on gigantic arbitrary spans
        if (safeAmount > 100000) safeAmount = 100000

        let calculated: Date = parsed

        if (operation === 'add') {
            if (unit === 'days') {
                calculated = businessDaysOnly ? addBusinessDays(parsed, safeAmount) : addDays(parsed, safeAmount)
            } else if (unit === 'weeks') {
                // Business days parameter has no strict 'week' counterpart in date-fns, 
                // standard is just 5 days per week if forcing business logic
                calculated = businessDaysOnly ? addBusinessDays(parsed, safeAmount * 5) : addWeeks(parsed, safeAmount)
            } else if (unit === 'months') {
                // Standard month addition, if ending on weekend and businessDaysOnly strictly needed you'd normally roll to Monday
                // date-fns doesn't natively do "add month keeping business days" but we can check if the result is weekend and shift
                calculated = addMonths(parsed, safeAmount)
                if (businessDaysOnly) {
                    calculated = addBusinessDays(calculated, 0) // Nudges weekend correctly if date-fns supports 0 shift, else manual:
                    const day = calculated.getDay()
                    if (day === 0) calculated = addDays(calculated, 1) // Sunday -> Monday
                    if (day === 6) calculated = addDays(calculated, 2) // Saturday -> Monday
                }
            }
        } else {
            if (unit === 'days') {
                calculated = businessDaysOnly ? subBusinessDays(parsed, safeAmount) : subDays(parsed, safeAmount)
            } else if (unit === 'weeks') {
                calculated = businessDaysOnly ? subBusinessDays(parsed, safeAmount * 5) : subWeeks(parsed, safeAmount)
            } else if (unit === 'months') {
                calculated = subMonths(parsed, safeAmount)
                if (businessDaysOnly) {
                    const day = calculated.getDay()
                    if (day === 0) calculated = subDays(calculated, 2) // Sunday -> Friday
                    if (day === 6) calculated = subDays(calculated, 1) // Saturday -> Friday
                }
            }
        }

        setResultDate(format(calculated, "yyyy-MM-dd'T'HH:mm:ss"))
        setResultFormatted(format(calculated, 'PPpp'))
    }, [baseDate, operation, unit, amount, businessDaysOnly])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        calculate()
    }, [calculate])

    const copyToClipboard = async (text: string) => {
        if (text && text !== '-') {
            try {
                await navigator.clipboard.writeText(text)
            } catch (err) {
                console.error('Failed to copy: ', err)
            }
        }
    }

    // Simple custom switch using checkboxes since Radix Switch wasn't found in dependencies payload
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Date Mathematics</CardTitle>
                    <CardDescription>Add or subtract time periods securely</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="base-date">Base Date</Label>
                        <Input
                            id="base-date"
                            type="datetime-local"
                            value={baseDate}
                            onChange={e => setBaseDate(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-end">
                        <div className="space-y-2">
                            <Label>Operation</Label>
                            <div className="flex border rounded-md">
                                <button
                                    className={`flex-1 flex items-center justify-center p-2 rounded-l-md transition-colors ${operation === 'add' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                                    onClick={() => setOperation('add')}
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Add
                                </button>
                                <button
                                    className={`flex-1 flex items-center justify-center p-2 rounded-r-md transition-colors ${operation === 'subtract' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                                    onClick={() => setOperation('subtract')}
                                >
                                    <Minus className="w-4 h-4 mr-1" /> Sub
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                min="0"
                                value={amount.toString()}
                                onChange={e => setAmount(parseInt(e.target.value) || 0)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="unit">Unit</Label>
                            <select
                                id="unit"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={unit}
                                onChange={e => setUnit(e.target.value as 'days' | 'weeks' | 'months')}
                            >
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                                <option value="months">Months</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <input
                            type="checkbox"
                            id="business-days"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={businessDaysOnly}
                            onChange={e => setBusinessDaysOnly(e.target.checked)}
                        />
                        <Label htmlFor="business-days" className="font-normal cursor-pointer">
                            Business Days Only (Skip weekends)
                        </Label>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Result</CardTitle>
                    <CardDescription>Shifted date calculation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error ? (
                        <div className="text-destructive font-medium">{error}</div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-semibold">Human Readable</Label>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(resultFormatted)}>
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                                <div className="p-3 bg-secondary rounded-md text-lg font-bold">{resultFormatted}</div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-semibold">ISO 8601 String</Label>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(resultDate)}>
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                                <div className="p-3 bg-secondary rounded-md text-sm font-mono break-all">{resultDate}</div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
