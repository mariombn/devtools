import {
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Box,
  Stack,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CopyButton } from '../../components/Common/CopyButton';

interface GeneratorCardProps {
  title: string;
  value: string;
  onGenerate: () => void;
  icon?: React.ReactElement;
}

export function GeneratorCard({ title, value, onGenerate, icon }: GeneratorCardProps) {
  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon && <Box sx={{ mr: 1 }}>{icon}</Box>}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton onClick={onGenerate} color="primary" size="small">
            <RefreshIcon />
          </IconButton>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            fullWidth
            value={value}
            InputProps={{
              readOnly: true,
              sx: { fontFamily: 'monospace' },
            }}
            size="small"
          />
          <CopyButton text={value} size="medium" />
        </Stack>
      </CardContent>
    </Card>
  );
}
