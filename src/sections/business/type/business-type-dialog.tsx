'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FormProvider from 'src/components/hook-form';
import RHFTextField from 'src/components/hook-form/rhf-text-field';
import { IBusinessType } from 'src/types/business';

const BusinessTypeSchema = Yup.object().shape({
  name: Yup.string().required('Type name is required'),
  description: Yup.string(),
});

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onSubmit: ((data: any) => Promise<void>) | ((id: string, data: any) => Promise<void>);
  currentBusinessType: IBusinessType | null;
};

export default function BusinessTypeDialog({
  open,
  onClose,
  onSubmit,
  currentBusinessType,
}: Props) {
  const methods = useForm({
    resolver: yupResolver(BusinessTypeSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSubmitForm = (data: any) => {
    if (currentBusinessType) {
      (onSubmit as (id: string, data: any) => Promise<void>)(currentBusinessType.id, data);
    } else {
      (onSubmit as (data: any) => Promise<void>)(data);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Business Type</DialogTitle>

      <DialogContent>
        <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmitForm)}>
          <Stack spacing={3} sx={{ py: 3 }}>
            <RHFTextField name="name" label="Type Name" />
            <RHFTextField name="description" label="Description" multiline rows={3} />

            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Create Type
            </LoadingButton>
          </Stack>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
