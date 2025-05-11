import { ConfirmDialog } from 'src/components/custom-dialog';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useBoolean } from '@/hooks/use-boolean';
import { useDispatch } from 'react-redux';
import { changeNewCat, gitCategories, openCreateDialog, setCategories, setEditMode, setError } from '@/redux/slices/CategoriesSlice';
import axiosInstance from '@/utils/axios';
import { deleteFile } from '@/utils/s3.client';
// import { useRouter } from 'next/router';

interface ListingCardProps {
  name?: string;
  icon: string;
  description?: string,
  id: string
}

export default function CatCard({ name, icon, description, id }: ListingCardProps) {
  const router = useRouter();
  const confirm = useBoolean();
  const dispatch = useDispatch()

  
  
const handleDelete = async (id: string) => {
  try {
    await deleteFile(icon);
    await axiosInstance.delete(`/services/categories/${id}/`);
    const data = await gitCategories();
    dispatch(setCategories(data));
    } catch (error) {
      console.log(error);
      dispatch(setError(error.message));
    }
  };
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
      <Box
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1', // Square aspect ratio
        borderRadius: 2,
        overflow: 'hidden',
      }}
      >
      <Image
    alt="title"
    src={icon || 'https://s3-alpha-sig.figma.com/img/388a/4284/302b32115afa54a1542db4d7a96cbdcf?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Lk~FMZgwKcGk4ECP0ToKfC~ma4iBMyS~15ffXacpr3laU6QPWZ8cjx-vx6WlSDwzrcd3Ak2ELNLTPpDeBFPTb08n41gHNzzhdgLgXam~AtlLG5eTau7VjU5YyW1rzTE~wedwmz7fH7YBSwGqRJxYI8ew7DhWPSDir5AR28yOSL9HjcF2NYNdGEQ36vh-dmjLh53GrZipeRb4gKRCFTuHLz2cD5KfmFTLBjY~zDQ1iqe5HFiSSnD84Ouw4VG8tW~Wg6ja1Sc4eGyPRKolRyw6UC1jAlPWfduX~Z6db~puVFEKV5POPZ3sUXoDNO1VwXhB-xC1VKF-ZkwqzpKI4lcF6Q__'}
    // layout="responsive" 
    fill
    style={{
      borderRadius: 8,
    }}
  />
      </Box>
        <Stack
        spacing={2}>
        {name && <TextField
          disabled
          id="outlined-disabled"
          label="Title"
          defaultValue={name}
          fullWidth
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-notchedOutline': {
              borderStyle: 'dashed', // Set the border style to dashed
            },
          }}
        />  }
          <TextField
          disabled
          id="outlined-disabled"
          label="Ad link"
          defaultValue={description}
          fullWidth
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-notchedOutline': {
              borderStyle: 'dashed', // Set the border style to dashed
            },
          }}
        />

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

            <LoadingButton sx={{display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            gap: 1,

            }} 
        onClick={() => {
          
          dispatch(setEditMode(id))

          dispatch(changeNewCat({
            value: name,
            field: 'name'
          }))
          dispatch(changeNewCat({
            value: icon,
            field: 'icon'
          }))
          dispatch(changeNewCat({
            value: description,
            field: 'description'
          }))
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
              Are you sure want to delete <strong> {name} </strong> Category?
            </>
          }
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleDelete(id);
                confirm.onFalse();
              }}
            >
              Delete
           </Button>
      }
    /> 
    </Stack>
  );
}
