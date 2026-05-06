import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/Layout/MainLayout'
import { JsonToolkit } from '@/pages/JsonToolkit'
import { DataGenerator } from '@/pages/DataGenerator'
import { TextComparator } from '@/pages/TextComparator'
import { BcryptGenerator } from '@/pages/BcryptGenerator'
import { CryptoToolkit } from '@/pages/CryptoToolkit'
import { MarkdownPreview } from '@/pages/MarkdownPreview'
import { SqlTools } from '@/pages/SqlTools'
import { Validators } from '@/pages/Validators'
import { DatesToolkit } from '@/pages/DatesToolkit'
import { RegexTools } from '@/pages/RegexTools'
import { useLanguage } from '@/i18n/LanguageContext'

function App() {
  const { t } = useLanguage()

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/json" replace />} />
        <Route
          path="/json"
          element={
            <MainLayout title={t('nav.jsonToolkit')} fullWidth>
              <JsonToolkit />
            </MainLayout>
          }
        />
        <Route
          path="/validators"
          element={
            <MainLayout title={t('nav.validators')}>
              <Validators />
            </MainLayout>
          }
        />
        <Route
          path="/generator"
          element={
            <MainLayout title={t('nav.dataGenerator')}>
              <DataGenerator />
            </MainLayout>
          }
        />
        <Route
          path="/diff"
          element={
            <MainLayout title={t('nav.textComparator')} fullWidth>
              <TextComparator />
            </MainLayout>
          }
        />
        <Route
          path="/bcrypt"
          element={
            <MainLayout title={t('nav.bcryptGenerator')}>
              <BcryptGenerator />
            </MainLayout>
          }
        />
        <Route
          path="/crypto"
          element={
            <MainLayout title={t('nav.cryptoToolkit')}>
              <CryptoToolkit />
            </MainLayout>
          }
        />
        <Route
          path="/markdown"
          element={
            <MainLayout title={t('nav.markdownPreview')} fullWidth>
              <MarkdownPreview />
            </MainLayout>
          }
        />
        <Route
          path="/sql"
          element={
            <MainLayout title={t('nav.sqlTools')} fullWidth>
              <SqlTools />
            </MainLayout>
          }
        />
        <Route
          path="/dates"
          element={
            <MainLayout title={t('nav.dateTimeTools')}>
              <DatesToolkit />
            </MainLayout>
          }
        />
        <Route
          path="/regex"
          element={
            <MainLayout title={t('nav.regexTools')} fullWidth>
              <RegexTools />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
