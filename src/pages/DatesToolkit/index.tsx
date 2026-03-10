import { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { UnixTimestampConverter } from '@/components/dates/UnixTimestampConverter'
import { DateDiffCalculator } from '@/components/dates/DateDiffCalculator'
import { IsoValidator } from '@/components/dates/IsoValidator'
import { TimezoneConverter } from '@/components/dates/TimezoneConverter'
import { PeriodMath } from '@/components/dates/PeriodMath'

export function DatesToolkit() {
    const [activeTab, setActiveTab] = useState('timestamp')

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Date & Time Tools</h1>
                <p className="text-muted-foreground mt-2">
                    Utilities for conversions, validation, operations, and timezone mathematics.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex w-full flex-wrap justify-start h-auto">
                    <TabsTrigger value="timestamp">Timestamp</TabsTrigger>
                    <TabsTrigger value="difference">Difference</TabsTrigger>
                    <TabsTrigger value="iso">ISO 8601</TabsTrigger>
                    <TabsTrigger value="timezone">Timezones</TabsTrigger>
                    <TabsTrigger value="periods">Add/Subtract</TabsTrigger>
                </TabsList>
                <div className="mt-4">
                    <TabsContent value="timestamp" className="mt-0">
                        <UnixTimestampConverter />
                    </TabsContent>
                    <TabsContent value="difference" className="mt-0">
                        <DateDiffCalculator />
                    </TabsContent>
                    <TabsContent value="iso" className="mt-0">
                        <IsoValidator />
                    </TabsContent>
                    <TabsContent value="timezone" className="mt-0">
                        <TimezoneConverter />
                    </TabsContent>
                    <TabsContent value="periods" className="mt-0">
                        <PeriodMath />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
