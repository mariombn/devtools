import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { formatInTimeZone, toDate } from 'date-fns-tz'
import { timezones } from '@/lib/timezones'

export function TimezoneConverter() {
    const [sourceDate, setSourceDate] = useState<string>('')

    // Timezones
    const [sourceTz, setSourceTz] = useState<string>('UTC')
    const [targetTz, setTargetTz] = useState<string>('America/Sao_Paulo')

    // Output
    const [convertedDate, setConvertedDate] = useState<string>('-')
    const [convertedIso, setConvertedIso] = useState<string>('-')

    useEffect(() => {
        // Current time locally, interpreted as the source TZ immediately
        const now = new Date()
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSourceDate(format(now, "yyyy-MM-dd'T'HH:mm"))
    }, [])

    const convertTime = useCallback(() => {
        if (!sourceDate) return

        try {
            // 1. We have a "local" string from the input (e.g. "2024-03-09T10:00")
            // 2. We pretend this exact string happened in the `sourceTz`

            // Parse it into a real Date object representing that exact moment in time globally
            const parsedZoned = toDate(sourceDate, { timeZone: sourceTz })

            // 3. Format that global moment into the `targetTz`
            const resultStr = formatInTimeZone(parsedZoned, targetTz, 'PPpp')
            const resultIso = formatInTimeZone(parsedZoned, targetTz, "yyyy-MM-dd'T'HH:mm:ssXXX")

            setConvertedDate(resultStr)
            setConvertedIso(resultIso)
        } catch {
            setConvertedDate('Invalid conversion')
            setConvertedIso('-')
        }
    }, [sourceDate, sourceTz, targetTz])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        convertTime()
    }, [convertTime])

    const copyToClipboard = async (text: string) => {
        if (text && text !== '-') {
            try {
                await navigator.clipboard.writeText(text)
            } catch (err) {
                console.error('Failed to copy: ', err)
            }
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Timezone Converter</CardTitle>
                    <CardDescription>Convert time instantly between different global regions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="source-date">Date & Time</Label>
                        <Input
                            id="source-date"
                            type="datetime-local"
                            value={sourceDate}
                            onChange={e => setSourceDate(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center pt-2">
                        <div className="space-y-2">
                            <Label htmlFor="source-tz">From Timezone</Label>
                            <select
                                id="source-tz"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={sourceTz}
                                onChange={e => setSourceTz(e.target.value)}
                            >
                                {timezones.map(tz => (
                                    <option key={tz} value={tz}>{tz}</option>
                                ))}
                            </select>
                        </div>

                        <ArrowRight className="h-5 w-5 mt-6 text-muted-foreground" />

                        <div className="space-y-2">
                            <Label htmlFor="target-tz">To Timezone</Label>
                            <select
                                id="target-tz"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={targetTz}
                                onChange={e => setTargetTz(e.target.value)}
                            >
                                {timezones.map(tz => (
                                    <option key={tz} value={tz}>{tz}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Result ({targetTz})</CardTitle>
                    <CardDescription>The converted exact time in the destination timezone</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-sm font-semibold">Formatted Date</Label>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(convertedDate)}>
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                        <div className="p-3 bg-secondary rounded-md text-lg font-bold">{convertedDate}</div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-sm font-semibold">ISO 8601 representation</Label>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(convertedIso)}>
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                        <div className="p-3 bg-secondary rounded-md text-sm font-mono break-all">{convertedIso}</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
