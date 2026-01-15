import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Alert,
  Paper,
  ButtonGroup,
  Typography,
} from '@mui/material';
import { PageTitle } from '../../components/Common/PageTitle';
import { CopyButton } from '../../components/Common/CopyButton';
import { validateJson, prettifyJson, minifyJson } from '../../utils/formatters/jsonFormatter';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export function JsonToolkit() {
  const [input, setInput] = useLocalStorage('json-input', '');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleValidate = () => {
    const result = validateJson(input);
    if (result.valid) {
      setError('');
      setOutput('✓ Valid JSON');
    } else {
      setError(result.error || 'Invalid JSON');
      setOutput('');
    }
  };

  const handlePrettify = () => {
    try {
      const formatted = prettifyJson(input, 2);
      setOutput(formatted);
      setError('');
    } catch (err) {
      setError('Invalid JSON - cannot prettify');
      setOutput('');
    }
  };

  const handleMinify = () => {
    try {
      const minified = minifyJson(input);
      setOutput(minified);
      setError('');
    } catch (err) {
      setError('Invalid JSON - cannot minify');
      setOutput('');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <Box>
      <PageTitle>JSON Toolkit</PageTitle>

      <Stack spacing={3}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Input</Typography>
            <ButtonGroup variant="outlined" size="small">
              <Button onClick={handleValidate}>Validate</Button>
              <Button onClick={handlePrettify}>Prettify</Button>
              <Button onClick={handleMinify}>Minify</Button>
              <Button onClick={handleClear} color="error">
                Clear
              </Button>
            </ButtonGroup>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={12}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste or type JSON here... e.g., {"name": "John", "age": 30}'
            sx={{
              '& .MuiInputBase-root': {
                fontFamily: 'monospace',
                fontSize: '14px',
              },
            }}
          />
        </Paper>

        {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {output && (
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Output</Typography>
              <CopyButton text={output} size="medium" />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={12}
              value={output}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'monospace',
                  fontSize: '14px',
                },
              }}
            />
          </Paper>
        )}
      </Stack>
    </Box>
  );
}
