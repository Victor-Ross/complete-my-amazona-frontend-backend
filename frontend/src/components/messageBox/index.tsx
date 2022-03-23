import { ReactNode } from 'react';
import { Alert } from 'react-bootstrap';

interface MessageBoxProps {
  variant?: string;
  children: ReactNode;
}

export function MessageBox({ variant, children }: MessageBoxProps) {
  return <Alert variant={variant || 'info'}>{children}</Alert>;
}
