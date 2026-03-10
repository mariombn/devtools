import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy, CheckCircle2, XCircle } from 'lucide-react'
import { parseISO, isValid, format } from 'date-fns'

export function IsoValidator() {
    const [inputString, setInputString] = useState<string>('')

    // Validation State
    const [isValidIso, setIsValidIso] = useState<boolean | null>(null)
    const [parsedDate, setParsedDate] = useState<Date | null>(null)

    useEffect(() => {
        // Default to current ISO
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInputString(new Date().toISOString())
    }, [])

    const validateString = useCallback((val: string) => {
        if (!val.trim()) {
            setIsValidIso(null)
            setParsedDate(null)
            return
        }

        try {
            // parseISO is strict about ISO-8601 formatting
            const date = parseISO(val)
            if (isValid(date)) {
                setIsValidIso(true)
                setParsedDate(date)
            } else {
                setIsValidIso(false)
                setParsedDate(null)
            }
        } catch {
            setIsValidIso(false)
            setParsedDate(null)
        }
    }, [])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        validateString(inputString)
    }, [inputString, validateString])

    const copyToClipboard = async (text: string) => {
        if (text) {
            try {
                await navigator.clipboard.writeText(text)
            } catch (err) {
                console.error('Failed to copy: ', err)
            }
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>ISO 8601 Validator</CardTitle>
                    <CardDescription>Validate ISO or RFC 3339 datetime strings instantly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="iso-input">Date String</Label>
                        <div className="relative">
                            <Input
                                id="iso-input"
                                placeholder="e.g. 2024-03-09T14:30:00Z"
                                value={inputString}
                                onChange={e => setInputString(e.target.value)}
                                className={`pr-10 ${isValidIso === true ? 'border-green-500 focus-visible:ring-green-500' : isValidIso === false ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                {isValidIso === true && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                                {isValidIso === false && <XCircle className="h-5 w-5 text-destructive" />}
                            </div>
                        </div>

                        <div className="pt-1 text-sm">
                            {isValidIso === true && <span className="text-green-600 dark:text-green-500 font-medium">Valid ISO 8601 Formatted String</span>}
                            {isValidIso === false && <span className="text-destructive font-medium">Invalid ISO string format</span>}
                            {isValidIso === null && <span className="text-muted-foreground">Type a string to validate</span>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {isValidIso && parsedDate && (
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Common Formats</CardTitle>
                        <CardDescription>The validated date formatted in standard patterns (Local Time)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                            {[
                                { label: 'YYYY-MM-DD HH:mm:ss', pattern: 'yyyy-MM-dd HH:mm:ss' },
                                { label: 'DD/MM/YYYY', pattern: 'dd/MM/yyyy' },
                                { label: 'MM/DD/YYYY', pattern: 'MM/dd/yyyy' },
                                { label: 'Human Readable', pattern: 'PPpp' }, // e.g. Apr 29, 1453, 12:00 AM
                                { label: 'Unix Timestamp', pattern: 't' }, // Timestamp ms
                            ].map(fmt => {
                                const formatted = format(parsedDate, fmt.pattern)
                                return (
                                    <div key={fmt.label} className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-xs text-muted-foreground">{fmt.label}</Label>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(formatted)}>
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <div className="p-2 bg-secondary rounded-md text-sm font-mono break-all">{formatted}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
