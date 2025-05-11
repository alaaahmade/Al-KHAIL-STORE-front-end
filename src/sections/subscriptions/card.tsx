import { ConfirmDialog } from 'src/components/custom-dialog';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useBoolean } from '@/hooks/use-boolean';
import { useDispatch , useSelector } from 'react-redux';
import { changeNewPlan, openCreateDialog, setEditMode } from '@/redux/slices/PlanSlice';

interface PlanCardProps {
  name?: string;
  credits: string;
  amountJOD?: string,
  id: string
  handleDelete?: any
}

export default function PlanCard({ name, credits, amountJOD, id, handleDelete }: PlanCardProps) {
  const confirm = useBoolean();
  const dispatch = useDispatch()
  const loadingB = useSelector((state: any) => state.PlansSlice.loadingB);

  return (
    <Stack
    spacing={3}
      sx={{
        // height: '20em',
        flexWrap: 'wrap',
        width: {
          xs: '100%',
          sm: '45%',
          md: '28%',
        },
        p: 1,
        m: 0,
        mb: 0.5,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
      }}
    >
  <Stack
        spacing={2}>
        {name && <TextField
          disabled
          id="outlined-disabled"
          label="Name"
          defaultValue={name}
          fullWidth
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-notchedOutline': {
              borderStyle: 'dashed',
            },
          }}
        />  }
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}>
        <TextField
          disabled
          id="outlined-disabled"
          label="Credits"
          defaultValue={credits}
          type='number'
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-notchedOutline': {
              borderStyle: 'dashed', 
            },
          }}
        />
        <TextField
          disabled
          id="outlined-disabled"
          label="Amount JOD"
          defaultValue={amountJOD}
          type='number'
          // fullWidth
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-notchedOutline': {
              borderStyle: 'dashed'
            },
          }}
        />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
            <IconButton onClick={confirm.onTrue} sx={{color: '#FF5630'}} >
              <Icon icon="solar:trash-bin-trash-bold" width="20" height="20" />
            </IconButton>
            <Typography variant="body2">{credits} Credits/Month : {amountJOD} JOD </Typography>
            <LoadingButton sx={{display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            gap: 1,

            }} 
        onClick={() => {          
          dispatch(changeNewPlan({
            value: id,
            field: 'id'
          }));
          dispatch(changeNewPlan({
            value: name,
            field: 'name'
          }))
          dispatch(changeNewPlan({
            value: credits,
            field: 'credits'
          }))
          dispatch(changeNewPlan({
            value: amountJOD,
            field: 'amountJOD'
          }))
          dispatch(setEditMode(id))
          dispatch(openCreateDialog());
        }}            >
            <Icon icon="fluent:edit-24-filled" width="18" height="18" />
              Edit
            </LoadingButton>
        </Box>
        </Stack>
        <ConfirmDialog
          open={confirm.value}
          onClose={confirm.onFalse}
          title="Delete"
          content={
            <>
              Are you sure want to delete <strong> {name} </strong> Ad?
            </>
          }
          action={
            <LoadingButton
              loading={loadingB}
              variant="contained"
              color="error"
              onClick={() => {
                handleDelete(id);
                confirm.onFalse();
              }}
            >
              Delete
           </LoadingButton>
      }
    />
    </Stack>
  );
}
