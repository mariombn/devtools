import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import {
    differenceInYears,
    differenceInMonths,
    differenceInDays,
    differenceInHours,
    format,
    isValid
} from 'date-fns'

export function DateDiffCalculator() {
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState<string>('')

    // Outputs
    const [diffParts, setDiffParts] = useState({ years: 0, months: 0, days: 0, hours: 0 })
    const [totalDays, setTotalDays] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Init with sensible defaults
        const now = new Date()
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStartDate(format(now, "yyyy-MM-dd'T'HH:mm"))
        setEndDate(format(nextWeek, "yyyy-MM-dd'T'HH:mm"))
    }, [])

    const calculateDiff = useCallback(() => {
        if (!startDate || !endDate) return

        const start = new Date(startDate)
        const end = new Date(endDate)

        if (!isValid(start) || !isValid(end)) {
            setError('Invalid date format')
            setTotalDays(null)
            return
        }

        setError(null)

        // Ensure we always subtract smaller from larger for absolute difference
        const isReversed = start > end
        const d1 = isReversed ? end : start
        const d2 = isReversed ? start : end

        const tDays = differenceInDays(d2, d1)
        setTotalDays(tDays)

        // Calculate detailed parts (approximate waterfall)
        const years = differenceInYears(d2, d1)

        // Subtract years to get remaining months
        const dateAfterYears = new Date(d1)
        dateAfterYears.setFullYear(d1.getFullYear() + years)
        const months = differenceInMonths(d2, dateAfterYears)

        // Subtract months to get remaining days
        const dateAfterMonths = new Date(dateAfterYears)
        dateAfterMonths.setMonth(dateAfterYears.getMonth() + months)
        const days = differenceInDays(d2, dateAfterMonths)

        // Subtract days to get remaining hours
        const dateAfterDays = new Date(dateAfterMonths)
        dateAfterDays.setDate(dateAfterMonths.getDate() + days)
        const hours = differenceInHours(d2, dateAfterDays)

        setDiffParts({ years, months, days, hours })
    }, [startDate, endDate])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        calculateDiff()
    }, [calculateDiff])

    const copyToClipboard = async (text: string) => {
        if (text) {
            try {
                await navigator.clipboard.writeText(text)
            } catch (err) {
                console.error('Failed to copy: ', err)
            }
        }
    }

    const displayParts = [
        diffParts.years > 0 ? `${diffParts.years} Years` : null,
        diffParts.months > 0 ? `${diffParts.months} Months` : null,
        diffParts.days > 0 ? `${diffParts.days} Days` : null,
        diffParts.hours > 0 ? `${diffParts.hours} Hours` : null,
    ].filter(Boolean).join(', ') || 'Identical'

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Date Difference</CardTitle>
                    <CardDescription>Calculate the exact distance between two dates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="start-date">Start Date & Time</Label>
                        <Input
                            id="start-date"
                            type="datetime-local"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="end-date">End Date & Time</Label>
                        <Input
                            id="end-date"
                            type="datetime-local"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Results</CardTitle>
                    <CardDescription>Difference breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error ? (
                        <div className="text-destructive text-sm font-medium">{error}</div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-semibold">Detailed Difference</Label>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(displayParts)}>
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                                <div className="p-3 bg-secondary rounded-md text-sm">{displayParts}</div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-semibold">Total Days</Label>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(`Total: ${totalDays} days`)}>
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                                <div className="p-3 bg-secondary rounded-md text-lg font-bold">Total: {totalDays} days</div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
