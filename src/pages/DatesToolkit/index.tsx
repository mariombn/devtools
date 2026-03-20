import { useState } from 'react'
import { PageTitle } from '@/components/Common/PageTitle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import { UnixTimestampConverter } from '@/components/dates/UnixTimestampConverter'
import { DateDiffCalculator } from '@/components/dates/DateDiffCalculator'
import { IsoValidator } from '@/components/dates/IsoValidator'
import { TimezoneConverter } from '@/components/dates/TimezoneConverter'
import { PeriodMath } from '@/components/dates/PeriodMath'

const TABS = [
    { value: 'timestamp', label: 'Timestamp' },
    { value: 'difference', label: 'Difference' },
    { value: 'iso', label: 'ISO 8601' },
    { value: 'timezone', label: 'Timezones' },
    { value: 'periods', label: 'Add/Subtract' },
]

export function DatesToolkit() {
    const [activeTab, setActiveTab] = useState('timestamp')

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <PageTitle description="Utilities for conversions, validation, operations, and timezone mathematics.">
                Date &amp; Time Tools
            </PageTitle>

            <ToggleGroup value={activeTab} onValueChange={setActiveTab} className="w-fit">
                {TABS.map((tab) => (
                    <ToggleGroupItem key={tab.value} value={tab.value}>
                        {tab.label}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>

            <div className="mt-4">
                {activeTab === 'timestamp' && <UnixTimestampConverter />}
                {activeTab === 'difference' && <DateDiffCalculator />}
                {activeTab === 'iso' && <IsoValidator />}
                {activeTab === 'timezone' && <TimezoneConverter />}
                {activeTab === 'periods' && <PeriodMath />}
            </div>
        </div>
    )
}
