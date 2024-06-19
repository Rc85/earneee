import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Loading, Modal, Section } from '../../../../_shared/components';
import { useNavigate, useParams } from 'react-router-dom';
import {
  listRefunds,
  useDeleteRefundPhoto,
  useUpdateRefund,
  useUpdateRefundNotes,
  useUploadRefundPhoto
} from '../../../../_shared/api';
import dayjs from 'dayjs';
import {
  Box,
  Breadcrumbs,
  CircularProgress,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { mdiCheck, mdiClose, mdiCloseCircle, mdiNoteEdit, mdiNotePlus, mdiUpload } from '@mdi/js';
import Icon from '@mdi/react';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';

const Refund = () => {
  const params = useParams();
  const { refundId } = params;
  const { isLoading, data } = listRefunds({ refundId: refundId! });
  const { refunds } = data || {};
  const refund = refunds?.[0];
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (refund?.notes) {
      setNotes(refund.notes);
    }
  }, [refund]);

  const handleSuccess = (response: any) => {
    if (response.data.statusText) {
      enqueueSnackbar(response.data.statusText, { variant: 'success' });
    }

    setStatus('');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const updateRefund = useUpdateRefund(handleSuccess, handleError);
  const deleteRefundPhoto = useDeleteRefundPhoto(handleSuccess, handleError);
  const updateRefundNotes = useUpdateRefundNotes(handleSuccess, handleError);
  const uploadRefundPhotos = useUploadRefundPhoto(handleSuccess, handleError);

  const handleDecline = () => {
    if (refund) {
      setStatus('Declining');

      updateRefund.mutate({ refundId: refund.id, status: 'declined' });
    }
  };

  const handleRefund = () => {
    if (refund) {
      setStatus('Refunding');

      updateRefund.mutate({ refundId: refund.id, status: 'complete' });
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setStatus('Uploading');

    if (e.target.files) {
      const filePromises = [];

      for (const file of e.target.files) {
        filePromises.push(toBase64(file));
      }

      const photos = await Promise.all(filePromises);

      if (refund) {
        uploadRefundPhotos.mutate({ refundId: refund.id, photos: photos as string[] });
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (photoId: number) => {
    if (refund) {
      deleteRefundPhoto.mutate({ refundId: refund.id, photoId });
    }
  };

  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAddNotes = () => {
    if (refund) {
      setStatus('Adding Notes');

      updateRefundNotes.mutate({ refundId: refund.id, notes });
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <Breadcrumbs>
        <Link onClick={() => navigate('/orders/refunds')}>Refunds</Link>
      </Breadcrumbs>

      <Section
        title={`Order ${refund?.item?.order?.number}`}
        subtitle={`${dayjs(refund?.createdAt).format('YYYY-MM-DD')} \u2022 ${refund?.status}`}
        titleVariant='h3'
        actions={
          refund?.status === 'pending'
            ? [
                <LoadingButton
                  key='issue'
                  color='success'
                  startIcon={<Icon path={mdiCheck} size={1} />}
                  loadingIndicator={<CircularProgress size={20} />}
                  loading={status === 'Refunding'}
                  loadingPosition='start'
                  onClick={() => setStatus('Confirm Issue')}
                  sx={{ mr: 1 }}
                >
                  Issue
                </LoadingButton>,
                <LoadingButton
                  key='decline'
                  color='error'
                  startIcon={<Icon path={mdiClose} size={1} />}
                  loadingIndicator={<CircularProgress size={20} />}
                  loading={status === 'Declining'}
                  loadingPosition='start'
                  onClick={() => setStatus('Confirm Decline')}
                >
                  Decline
                </LoadingButton>
              ]
            : []
        }
      >
        <Modal
          open={status === 'Confirm Issue'}
          title='Are you sure you want to issue this refund?'
          subtitle='This action cannot be reverted'
          cancel={() => setStatus('')}
          submit={handleRefund}
        />

        <Modal
          open={status === 'Confirm Decline'}
          title='Are you sure you want to decline this refund?'
          subtitle='This action cannot be reverted'
          cancel={() => setStatus('')}
          submit={handleDecline}
        />

        <Modal
          open={status === 'Add Notes'}
          title={notes ? 'Edit Notes' : 'Add Notes'}
          disableBackdropClick
          submit={handleAddNotes}
          cancel={() => setStatus('')}
        >
          <TextField label='Notes' value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Modal>

        <Typography variant='h6' sx={{ mb: 0 }}>
          Details
        </Typography>

        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography>Reason</Typography>
                </TableCell>

                <TableCell>
                  <Typography>{refund?.reason || '-'}</Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Typography>Shipping Provider</Typography>
                </TableCell>

                <TableCell>
                  <Typography>{refund?.shippingProvider || '-'}</Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Typography>Tracking Number</Typography>
                </TableCell>

                <TableCell>
                  <Typography>{refund?.trackingNumber || '-'}</Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ verticalAlign: 'top' }}>
                  <Typography>Notes</Typography>
                </TableCell>

                <TableCell sx={{ verticalAlign: 'top' }}>
                  <Typography>{refund?.notes}</Typography>

                  <LoadingButton
                    loading={status === 'Adding Notes'}
                    loadingIndicator={<CircularProgress size={20} />}
                    loadingPosition='start'
                    startIcon={<Icon path={refund?.notes ? mdiNoteEdit : mdiNotePlus} size={1} />}
                    onClick={() => setStatus('Add Notes')}
                  >
                    {refund?.notes ? 'Edit Notes' : 'Add notes'}
                  </LoadingButton>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ verticalAlign: 'top' }}>
                  <Typography>Photos</Typography>
                </TableCell>

                <TableCell sx={{ verticalAlign: 'top' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    {refund?.photos?.map((photo) => (
                      <Box key={photo.id} sx={{ position: 'relative', mr: 1 }}>
                        <Box
                          sx={{
                            borderRadius: '100%',
                            backgroundColor: 'white',
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            zIndex: 1
                          }}
                        >
                          <IconButton
                            size='small'
                            color='error'
                            sx={{ p: 0.1 }}
                            onClick={() => handleRemovePhoto(photo.id)}
                          >
                            <Icon path={mdiCloseCircle} size={1} />
                          </IconButton>
                        </Box>

                        <Link href={photo.url} target='_blank'>
                          <img src={photo.url} style={{ width: '100px' }} />
                        </Link>
                      </Box>
                    ))}
                  </Box>

                  <LoadingButton
                    startIcon={<Icon path={mdiUpload} size={1} />}
                    loading={status === 'Uploading'}
                    loadingIndicator={<CircularProgress size={20} />}
                    loadingPosition='start'
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload photo
                  </LoadingButton>

                  <input type='file' hidden onChange={handleFileChange} ref={fileInputRef} multiple />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant='h6' sx={{ mt: 3, mb: 0 }}>
          Items
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontWeight: 500 }}>Item</Typography>
                </TableCell>

                <TableCell>
                  <Typography sx={{ fontWeight: 500 }}>Quantity</Typography>
                </TableCell>

                <TableCell>
                  <Typography sx={{ fontWeight: 500 }}>Request Amount</Typography>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography>{refund?.item?.name}</Typography>

                  {refund?.item?.product?.variants?.[0] && (
                    <Typography variant='body2' color='GrayText'>
                      {refund?.item?.product?.variants?.[0]?.name}
                    </Typography>
                  )}

                  {refund?.item?.product?.options?.map((option) => (
                    <Box key={option.id} sx={{ ml: 2 }}>
                      <Typography variant='body2' color='GrayText'>
                        {option.name}
                      </Typography>

                      {option.selections?.map((selection) => (
                        <Typography key={selection.id} variant='body2' color='GrayText'>
                          &bull; {selection.name}
                        </Typography>
                      ))}
                    </Box>
                  ))}
                </TableCell>

                <TableCell sx={{ verticalAlign: 'top' }}>
                  <Typography>{refund?.quantity}</Typography>
                </TableCell>

                <TableCell sx={{ verticalAlign: 'top' }}>
                  <Typography>${refund?.amount}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Section>
    </>
  );
};

export default Refund;
