import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy, RefreshCw } from 'lucide-react'
import { format, fromUnixTime, getUnixTime, isValid } from 'date-fns'

export function UnixTimestampConverter() {
    const [timestamp, setTimestamp] = useState<string>('')
    const [dateInput, setDateInput] = useState<string>('')

    // Outputs
    const [isoOutput, setIsoOutput] = useState<string>('-')
    const [utcOutput, setUtcOutput] = useState<string>('-')
    const [localOutput, setLocalOutput] = useState<string>('-')

    // Initialization
    useEffect(() => {
        const now = new Date()
        const currentTs = getUnixTime(now).toString()
        setTimestamp(currentTs)
        setDateInput(format(now, "yyyy-MM-dd'T'HH:mm"))
        updateOutputsFromTimestamp(currentTs)
    }, [])

    const updateOutputsFromTimestamp = (val: string) => {
        try {
            if (!val) {
                setIsoOutput('-')
                setUtcOutput('-')
                setLocalOutput('-')
                return
            }

            // Handle milliseconds vs seconds loosely
            const numericVal = Number(val)
            if (isNaN(numericVal)) throw new Error('Invalid number')

            const dateObj = val.length > 10 ? new Date(numericVal) : fromUnixTime(numericVal)

            if (!isValid(dateObj)) throw new Error('Invalid date')

            setIsoOutput(dateObj.toISOString())
            setUtcOutput(dateObj.toUTCString())
            setLocalOutput(dateObj.toString())

            // Update reverse input if user is driving from the timestamp side
            setDateInput(format(dateObj, "yyyy-MM-dd'T'HH:mm:ss"))
        } catch {
            setIsoOutput('Invalid or out of range')
            setUtcOutput('Invalid or out of range')
            setLocalOutput('Invalid or out of range')
        }
    }

    const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setTimestamp(val)
        updateOutputsFromTimestamp(val)
    }

    const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setDateInput(val)

        try {
            const parsed = new Date(val)
            if (isValid(parsed)) {
                const ts = getUnixTime(parsed).toString()
                setTimestamp(ts)
                updateOutputsFromTimestamp(ts)
            } else {
                setTimestamp('')
            }
        } catch {
            // do nothing on partial
        }
    }

    const setToNow = () => {
        const now = new Date()
        const ts = getUnixTime(now).toString()
        setTimestamp(ts)
        setDateInput(format(now, "yyyy-MM-dd'T'HH:mm:ss"))
        updateOutputsFromTimestamp(ts)
    }

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
                    <CardTitle>Unix Timestamp to Date</CardTitle>
                    <CardDescription>Convert seconds or milliseconds to human-readable dates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="timestamp">Enter Timestamp</Label>
                        <div className="flex space-x-2">
                            <Input
                                id="timestamp"
                                placeholder="e.g. 1709899200"
                                value={timestamp}
                                onChange={handleTimestampChange}
                            />
                            <Button variant="outline" size="icon" onClick={setToNow} title="Current Time">
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs text-muted-foreground">ISO 8601</Label>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(isoOutput)}>
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                            <div className="p-2 bg-secondary rounded-md text-sm font-mono break-all">{isoOutput}</div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs text-muted-foreground">UTC Time</Label>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(utcOutput)}>
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                            <div className="p-2 bg-secondary rounded-md text-sm font-mono break-all">{utcOutput}</div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs text-muted-foreground">Local Time</Label>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(localOutput)}>
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                            <div className="p-2 bg-secondary rounded-md text-sm font-mono break-all">{localOutput}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Date to Unix Timestamp</CardTitle>
                    <CardDescription>Convert a calendar date back to a timestamp</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="dateInput">Select Date & Time</Label>
                        <Input
                            id="dateInput"
                            type="datetime-local"
                            step="1"
                            value={dateInput}
                            onChange={handleDateInputChange}
                        />
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs text-muted-foreground">Unix Timestamp (Seconds)</Label>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(timestamp)}>
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                            <div className="p-2 bg-secondary rounded-md text-2xl font-mono text-center">{timestamp || '-'}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
