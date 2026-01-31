import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/Layout/MainLayout'
import { JsonToolkit } from '@/pages/JsonToolkit'
import { DataGenerator } from '@/pages/DataGenerator'
import { TextComparator } from '@/pages/TextComparator'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/json" replace />} />
        <Route
          path="/json"
          element={
            <MainLayout title="JSON Toolkit">
              <JsonToolkit />
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
            <MainLayout title="Text Comparator">
              <TextComparator />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
