import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/Layout/MainLayout'
import { JsonToolkit } from '@/pages/JsonToolkit'
import { DataGenerator } from '@/pages/DataGenerator'
import { TextComparator } from '@/pages/TextComparator'
import { BcryptGenerator } from '@/pages/BcryptGenerator'
import { MarkdownPreview } from '@/pages/MarkdownPreview'
import { SqlTools } from '@/pages/SqlTools'
import { Validators } from '@/pages/Validators'
import { DatesToolkit } from '@/pages/DatesToolkit'
import { RegexTools } from '@/pages/RegexTools'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/json" replace />} />
        <Route
          path="/json"
          element={
            <MainLayout title="JSON Toolkit" fullWidth>
              <JsonToolkit />
            </MainLayout>
          }
        />
        <Route
          path="/validators"
          element={
            <MainLayout title="Validators">
              <Validators />
            </MainLayout>
          }
        />
        <Route
          path="/generator"
          element={
            <MainLayout title="Data Generator">
              <DataGenerator />
            </MainLayout>
          }
        />
        <Route
          path="/diff"
          element={
            <MainLayout title="Text Comparator" fullWidth>
              <TextComparator />
            </MainLayout>
          }
        />
        <Route
          path="/bcrypt"
          element={
            <MainLayout title="Bcrypt Generator">
              <BcryptGenerator />
            </MainLayout>
          }
        />
        <Route
          path="/markdown"
          element={
            <MainLayout title="Markdown Preview" fullWidth>
              <MarkdownPreview />
            </MainLayout>
          }
        />
        <Route
          path="/sql"
          element={
            <MainLayout title="SQL Tools" fullWidth>
              <SqlTools />
            </MainLayout>
          }
        />
        <Route
          path="/dates"
          element={
            <MainLayout title="Date & Time Tools">
              <DatesToolkit />
            </MainLayout>
          }
        />
        <Route
          path="/regex"
          element={
            <MainLayout title="Regex Tools" fullWidth>
              <RegexTools />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
