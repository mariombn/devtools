import { useState } from 'react'
import { PageTitle } from '@/components/Common/PageTitle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import { UnixTimestampConverter } from '@/components/dates/UnixTimestampConverter'
import { DateDiffCalculator } from '@/components/dates/DateDiffCalculator'
import { IsoValidator } from '@/components/dates/IsoValidator'
import { TimezoneConverter } from '@/components/dates/TimezoneConverter'
import { PeriodMath } from '@/components/dates/PeriodMath'

import { useLanguage } from '@/i18n/LanguageContext'
import type { TranslationKey } from '@/i18n/LanguageContext'

const TABS: Array<{ value: string; labelKey: TranslationKey }> = [
    { value: 'timestamp', labelKey: 'dates.tabTimestamp' },
    { value: 'difference', labelKey: 'dates.tabDifference' },
    { value: 'iso', labelKey: 'dates.tabIso' },
    { value: 'timezone', labelKey: 'dates.tabTimezone' },
    { value: 'periods', labelKey: 'dates.tabPeriods' },
]

export function DatesToolkit() {
    const { t } = useLanguage()
    const [activeTab, setActiveTab] = useState('timestamp')

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <PageTitle description={t('dates.description')}>
                {t('dates.title')}
            </PageTitle>

            <ToggleGroup value={activeTab} onValueChange={setActiveTab} className="w-fit">
                {TABS.map((tab) => (
                    <ToggleGroupItem key={tab.value} value={tab.value}>
                        {t(tab.labelKey)}
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
