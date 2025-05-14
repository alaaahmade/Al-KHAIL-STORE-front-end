'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MenuItem, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FormProvider from 'src/components/hook-form';
import RHFTextField from 'src/components/hook-form/rhf-text-field';
import { useEffect } from 'react';
import { IBusiness } from 'src/types/business';
import { IUser } from 'src/types/user';
import { useAppSelector, useAppDispatch } from 'src/redux/hooks';
import { fetchBusinessTypes } from '@/redux/slices/businessSlice';

const BusinessSchema = Yup.object().shape({
  name: Yup.string().required('Business name is required'),
  address: Yup.string().required('Business address is required'),
  contactEmail: Yup.string().required('Contact email is required').email('Invalid email'),
  contactNumber: Yup.string().required('Contact number is required'),
  typeId: Yup.string().required('Business type is required'),
  owner: Yup.mixed().required('Owner is required'),
});

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onSubmit: ((data: any) => Promise<void>) | ((id: string, data: any) => Promise<void>);
  users: IUser[];
  currentBusiness: IBusiness | null;
};

export default function BusinessDialog({ open, onClose, onSubmit, users, currentBusiness }: Props) {
  const methods = useForm({
    resolver: yupResolver(BusinessSchema),
    defaultValues: {
      name: currentBusiness?.name || '',
      address: currentBusiness?.address || '',
      contactEmail: currentBusiness?.contactEmail || '',
      contactNumber: currentBusiness?.contactNumber || '',
      typeId: currentBusiness?.type?.id || '',
      owner: currentBusiness?.owner?.id || '',
    },
  });
  const dispatch = useAppDispatch();
  const { businessTypes, loading } = useAppSelector((state) => state.business);

  useEffect(() => {
    dispatch(fetchBusinessTypes());
  }, [dispatch]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const businessTypeOptions = businessTypes.map((type) => ({
    value: type?.value || '',
    label: type?.label || '',
  }));

  const handleSubmitForm = (data: any) => {
    if (currentBusiness) {
      (onSubmit as (id: string, data: any) => Promise<void>)(currentBusiness.id, data);
    } else {
      (onSubmit as (data: any) => Promise<void>)(data);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{currentBusiness ? 'Edit Business' : 'Create New Business'}</DialogTitle>

      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(handleSubmitForm)}>
          <Stack spacing={3} sx={{ py: 3 }}>
            <RHFTextField name="name" label="Business Name" />
            <RHFTextField name="address" label="Address" />
            <RHFTextField name="contactEmail" label="Contact Email" />
            <RHFTextField name="contactNumber" label="Contact Number" />
            <RHFTextField name="typeId" label="Business Type" select>
              {businessTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFTextField>

            <RHFTextField name="owner" label="Owner" select>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </MenuItem>
              ))}
            </RHFTextField>

            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {currentBusiness ? 'Update Business' : 'Create Business'}
            </LoadingButton>
          </Stack>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
