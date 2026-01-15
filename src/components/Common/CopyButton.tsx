import { IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useClipboard } from '../../hooks/useClipboard';

interface CopyButtonProps {
  text: string;
  size?: 'small' | 'medium' | 'large';
}

export function CopyButton({ text, size = 'small' }: CopyButtonProps) {
  const { copy, copied } = useClipboard();

  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
      <IconButton onClick={() => copy(text)} size={size}>
        {copied ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}
