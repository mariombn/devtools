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
  const disabled = !text;

  const handleCopy = () => {
    if (text) {
      copy(text);
    }
  };

  return (
    <Tooltip title={disabled ? 'No content to copy' : copied ? 'Copied!' : 'Copy to clipboard'}>
      <span>
        <IconButton onClick={handleCopy} size={size} disabled={disabled}>
          {copied ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
        </IconButton>
      </span>
    </Tooltip>
  );
}
