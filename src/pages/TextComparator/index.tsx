import { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
} from '@mui/material';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { PageTitle } from '../../components/Common/PageTitle';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import * as Diff from 'diff';

type ViewMode = 'split' | 'unified';

export function TextComparator() {
  const [originalText, setOriginalText] = useLocalStorage('diff-original', '');
  const [modifiedText, setModifiedText] = useLocalStorage('diff-modified', '');
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  const getDiff = () => {
    return Diff.diffLines(originalText, modifiedText);
  };

  const renderUnifiedView = () => {
    const diff = getDiff();

    return (
      <Paper
        elevation={2}
        sx={{
          p: 2,
          fontFamily: 'monospace',
          fontSize: '14px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: '600px',
          overflow: 'auto',
        }}
      >
        {diff.map((part, index) => {
          const color = part.added ? '#d4edda' : part.removed ? '#f8d7da' : 'transparent';
          const textColor = part.added ? '#155724' : part.removed ? '#721c24' : 'inherit';
          const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';

          return (
            <Box
              key={index}
              sx={{
                backgroundColor: color,
                color: textColor,
                padding: '2px 4px',
                borderLeft: part.added || part.removed ? '3px solid' : 'none',
                borderLeftColor: part.added ? '#28a745' : part.removed ? '#dc3545' : 'transparent',
              }}
            >
              {part.value.split('\n').map((line, i) => (
                <div key={i}>
                  {prefix}
                  {line}
                </div>
              ))}
            </Box>
          );
        })}
      </Paper>
    );
  };

  const renderSplitView = () => {
    const diff = getDiff();

    const originalLines: Array<{ text: string; removed?: boolean }> = [];
    const modifiedLines: Array<{ text: string; added?: boolean }> = [];

    diff.forEach((part) => {
      const lines = part.value.split('\n').filter((line) => line !== '');

      if (part.removed) {
        lines.forEach((line) => originalLines.push({ text: line, removed: true }));
      } else if (part.added) {
        lines.forEach((line) => modifiedLines.push({ text: line, added: true }));
      } else {
        lines.forEach((line) => {
          originalLines.push({ text: line });
          modifiedLines.push({ text: line });
        });
      }
    });

    // Equilibrar arrays
    const maxLength = Math.max(originalLines.length, modifiedLines.length);
    while (originalLines.length < maxLength) originalLines.push({ text: '' });
    while (modifiedLines.length < maxLength) modifiedLines.push({ text: '' });

    return (
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              fontFamily: 'monospace',
              fontSize: '14px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: '600px',
              overflow: 'auto',
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Original
            </Typography>
            {originalLines.map((line, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: line.removed ? '#f8d7da' : 'transparent',
                  color: line.removed ? '#721c24' : 'inherit',
                  padding: '2px 4px',
                  borderLeft: line.removed ? '3px solid #dc3545' : 'none',
                }}
              >
                {line.text || '\u00A0'}
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              fontFamily: 'monospace',
              fontSize: '14px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: '600px',
              overflow: 'auto',
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Modified
            </Typography>
            {modifiedLines.map((line, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: line.added ? '#d4edda' : 'transparent',
                  color: line.added ? '#155724' : 'inherit',
                  padding: '2px 4px',
                  borderLeft: line.added ? '3px solid #28a745' : 'none',
                }}
              >
                {line.text || '\u00A0'}
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <PageTitle>Text Comparator</PageTitle>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => newMode && setViewMode(newMode)}
          size="small"
        >
          <ToggleButton value="split">
            <ViewColumnIcon sx={{ mr: 1 }} />
            Split
          </ToggleButton>
          <ToggleButton value="unified">
            <ViewStreamIcon sx={{ mr: 1 }} />
            Unified
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Stack spacing={3}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Original Text
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={10}
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Enter original text here..."
                sx={{
                  '& .MuiInputBase-root': {
                    fontFamily: 'monospace',
                    fontSize: '14px',
                  },
                }}
              />
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Modified Text
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={10}
                value={modifiedText}
                onChange={(e) => setModifiedText(e.target.value)}
                placeholder="Enter modified text here..."
                sx={{
                  '& .MuiInputBase-root': {
                    fontFamily: 'monospace',
                    fontSize: '14px',
                  },
                }}
              />
            </Paper>
          </Grid>
        </Grid>

        {(originalText || modifiedText) && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Comparison Result
            </Typography>
            {viewMode === 'split' ? renderSplitView() : renderUnifiedView()}
          </Box>
        )}
      </Stack>
    </Box>
  );
}
