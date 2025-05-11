import { ConfirmDialog } from 'src/components/custom-dialog';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import { Box, Button, IconButton, Stack, TextField } from '@mui/material';
import Image from 'next/image';
import { useBoolean } from '@/hooks/use-boolean';
import { useDispatch } from 'react-redux';
import { changeIsHome, changeNewAd, openCreateDialog, setEditMode } from '@/redux/slices/AdsSlice';

interface ListingCardProps {
  title?: string;
  image: string;
  link?: string,
  id: string
  handleDelete?: any
  isHome: boolean
}

export default function AdsCard({ title, image, link, id, handleDelete, isHome }: ListingCardProps) {
  const confirm = useBoolean();
  const dispatch = useDispatch()



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
        aspectRatio: '16/9', 
        borderRadius: 2,
        overflow: 'hidden',
      }}
      >
      <Image
      alt="title"
      src={image}
      // layout="responsive" 
      fill
      style={{
        borderRadius: 8,
      }}
    />
    </Box>
  <Stack
        spacing={2}>
        {title && <TextField
          disabled
          id="outlined-disabled"
          label="Title"
          defaultValue={title}
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
          defaultValue={link}
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
          dispatch(changeNewAd({
            value: id,
            field: 'id'
          }));
          dispatch(changeNewAd({
            value: title,
            field: 'title'
          }))
          dispatch(changeNewAd({
            value: image,
            field: 'image'
          }))
          dispatch(changeNewAd({
            value: link,
            field: 'link'
          }))
          dispatch(changeIsHome(isHome))
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
              Are you sure want to delete <strong> {title} </strong> Ad?
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
