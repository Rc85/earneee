import { mdiArrowUpDropCircle, mdiCancel } from '@mdi/js';
import { Icon } from '@mdi/react';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';
import { ElementType, FormEvent } from 'react';

interface Props {
  open: boolean;
  title: string;
  subtitle?: string;
  cancel?: () => void;
  submit?: (e?: FormEvent) => void;
  submitText?: string;
  cancelText?: string;
  children?: any;
  disableBackdropClick?: boolean;
  loading?: boolean;
  component?: ElementType<any>;
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Modal = ({
  open,
  title,
  subtitle,
  cancel,
  submit,
  submitText = 'Submit',
  cancelText = 'Cancel',
  children,
  disableBackdropClick,
  loading,
  component,
  maxWidth
}: Props) => {
  const handleOnClose = (_e: FormEvent, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (!reason || (reason === 'backdropClick' && !disableBackdropClick)) {
      cancel?.();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    submit?.(e);
  };

  return (
    <Dialog
      open={open}
      onClose={handleOnClose}
      component={component}
      fullWidth
      onSubmit={handleSubmit}
      maxWidth={maxWidth}
    >
      <DialogTitle sx={{ mb: 0 }}>
        {title}

        {subtitle && <Typography color='GrayText'>{subtitle}</Typography>}
      </DialogTitle>

      {children && <DialogContent>{children}</DialogContent>}

      <DialogActions sx={{ px: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          {submit && (
            <LoadingButton
              loading={Boolean(loading)}
              loadingPosition='start'
              loadingIndicator={<CircularProgress size={20} />}
              type='submit'
              onClick={handleSubmit}
              variant='contained'
              fullWidth
              startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
              sx={{ mb: 1 }}
            >
              {submitText}
            </LoadingButton>
          )}

          {cancel && (
            <Button color='inherit' onClick={cancel} fullWidth startIcon={<Icon path={mdiCancel} size={1} />}>
              {cancelText}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
