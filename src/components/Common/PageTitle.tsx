import { Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface PageTitleProps {
  children: ReactNode;
}

export function PageTitle({ children }: PageTitleProps) {
  return (
    <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
      {children}
    </Typography>
  );
}
