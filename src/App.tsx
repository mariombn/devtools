import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { MainLayout } from './components/Layout/MainLayout';
import { JsonToolkit } from './pages/JsonToolkit';
import { DataGenerator } from './pages/DataGenerator';
import { TextComparator } from './pages/TextComparator';

function App() {
  return (
    <Box>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/json" replace />} />
          <Route
            path="/json"
            element={
              <MainLayout title="DevTools - JSON Toolkit">
                <JsonToolkit />
              </MainLayout>
            }
          />
          <Route
            path="/generator"
            element={
              <MainLayout title="DevTools - Data Generator">
                <DataGenerator />
              </MainLayout>
            }
          />
          <Route
            path="/diff"
            element={
              <MainLayout title="DevTools - Text Comparator">
                <TextComparator />
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
