'use client';

// @mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import { LoadingButton } from '@mui/lab';
import { useEffect } from 'react';
import { useAppDispatch } from 'src/redux/hooks';
import { useSelector } from 'react-redux';
import { CreateAdDialog } from 'src/components/custom-dialog/createAdDialog';
import { changeIsHome, changeNewAd, closeCreateDialog, gitAdvertisements, openCreateDialog, setAdvertisements, setEditMode, setLadingB } from '@/redux/slices/SellersSlice';
import axiosInstance from '@/utils/axios';
import { setError } from '@/redux/slices/notificationSlice';
import { deleteFile, uploadFile } from '@/utils/s3.client';
import { useBoolean } from '@/hooks/use-boolean';
import AdsCard from '../card';
// ----------------------------------------------------------------------

export function AdsView() {
  const settings = useSettingsContext();
  const dispatch = useAppDispatch();
  const newAd = useSelector((state: any) => state.AdvertisementsSlice.newAd)
  const editMode = useSelector((state: any) => state.AdvertisementsSlice.editMode);
  const advertisements = useSelector((state: any) => state.AdvertisementsSlice.advertisements);
  const isHome = useSelector((state: any) => state.AdvertisementsSlice.isHome);
  const refresh = useBoolean();
  const open = useSelector((state: any) => state.AdvertisementsSlice.open);

  const handleSave = async () => {
    try {
      const newErrors: any = {};

      if (!isHome && !newAd.title.trim()) {
        newErrors.title = 'Please enter a title for the category';
      }
  
      if (!newAd.image) {
        newErrors.icon = 'Please upload an icon for the category';
      }
  
      if (!newAd.link.trim()) {
        newErrors.description = 'Please enter a description for the category';
      }      
      if (Object.keys(newErrors).length > 0) {
        dispatch(setError(newErrors));
        return;
      }
      dispatch(setLadingB(true));

      let url;
      const iconFile = newAd.image;
  
      if (iconFile) {
        
        if (typeof iconFile === 'string') {
          url = iconFile;
        }else {

          const mimeType = iconFile.type;
          const fileBuffer = Buffer.from(await iconFile.arrayBuffer());
    
          url = await uploadFile(fileBuffer, `Advertisements/${iconFile.name + Date.now()}`, mimeType);
    
         await dispatch(changeNewAd({ value: url, field: 'image' }))          
    
          if (editMode) {
            await deleteFile('iconFile');
          }
    
        }
      }
      
      if(!editMode){
        if(isHome){
          await axiosInstance.post('/advertisements', {
            image: url  || newAd.image,
            link: newAd.link,
            type: 'home'
          });

        }else{
          await axiosInstance.post('/advertisements', {
            title: newAd.title,
            image: url  || newAd.image,
            link: newAd.link,
            type:'search'
          });
        }
      refresh.onToggle()
    } else {
      if(isHome){
      await axiosInstance.patch(`/advertisements/${editMode}`, {
        image: url  || newAd.image,
        link: newAd.link,
        type: 'home'
      });

      refresh.onToggle()

    } else {
      await axiosInstance.patch(`/advertisements/${editMode}`, {
        title: newAd.title,
        image: url  || newAd.image,
        link: newAd.link,
        type:'search'
      });
      // await dispatch(setAdvertisements([]))
      refresh.onToggle()    }
    dispatch(setAdvertisements([]))
  }
      dispatch(setLadingB(false));
      dispatch(closeCreateDialog());
      dispatch(setEditMode(undefined))
      dispatch(changeNewAd({ value: '', field: 'title' }));
      dispatch(changeNewAd({ value: '', field: 'image' }));
      dispatch(changeNewAd({ value: '', field: 'link' }));
      dispatch(changeNewAd({ value: '', field: 'id' }));
      dispatch(changeIsHome(false))
  
    } catch (error) {
      dispatch(setLadingB(false));
      console.log(error);
      dispatch(setError(error.message));
    }
  }
  


  useEffect(() => {
    async function getAds() {      
      const ads =await gitAdvertisements();
      await dispatch(setAdvertisements(ads));
    }
    getAds();
  }, [refresh.value]);  
  const handleDelete =async (id: any) => {
    try {
      await axiosInstance.delete(`/advertisements/${id}/`);
      const ads =await gitAdvertisements();
      dispatch(setAdvertisements(ads));
      
      } catch (error) {
        console.log(error);
        dispatch(setError(error.message));
      }
  }

  const handleClose = () => {
    dispatch(setLadingB(false));
    dispatch(changeNewAd({ value: '', field: 'title' }));
    dispatch(changeNewAd({ value: '', field: 'image' }));
    dispatch(changeNewAd({ value: '', field: 'link' }));
    dispatch(changeNewAd({ value: '', field: 'id' }));
    dispatch(changeIsHome(false))
    dispatch(closeCreateDialog());
  }




  const handleOpen = () => {
    dispatch(openCreateDialog());
  }
  

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} >
      <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box>
      <Typography variant="h4"> Home page ads </Typography>
      <Typography sx={{
        fontSize: '14px',
        color: '#637381',
        letterSpacing: 0,
        fontWeight: 400
      }}>The images that show inside the slider at the top of the app’s home page</Typography>
      </Box>
      <LoadingButton
        color="inherit"
        type="submit"
        variant="contained"
        startIcon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.16667 14.6667C7.16667 14.8877 7.25446 15.0996 7.41074 15.2559C7.56702 15.4122 7.77899 15.5 8 15.5C8.22101 15.5 8.43297 15.4122 8.58926 15.2559C8.74554 15.0996 8.83333 14.8877 8.83333 14.6667V8.83333H14.6667C14.8877 8.83333 15.0996 8.74554 15.2559 8.58926C15.4122 8.43297 15.5 8.22101 15.5 8C15.5 7.77899 15.4122 7.56702 15.2559 7.41074C15.0996 7.25446 14.8877 7.16667 14.6667 7.16667H8.83333V1.33333C8.83333 1.11232 8.74554 0.900358 8.58926 0.744078C8.43297 0.587797 8.22101 0.5 8 0.5C7.77899 0.5 7.56702 0.587797 7.41074 0.744078C7.25446 0.900358 7.16667 1.11232 7.16667 1.33333V7.16667H1.33333C1.11232 7.16667 0.900358 7.25446 0.744078 7.41074C0.587797 7.56702 0.5 7.77899 0.5 8C0.5 8.22101 0.587797 8.43297 0.744078 8.58926C0.900358 8.74554 1.11232 8.83333 1.33333 8.83333H7.16667V14.6667Z" fill="white"/>
          </svg>
          }
        onClick={() => {
          dispatch(changeIsHome(true))
          handleOpen();
        }}
        sx={{
          height: '3em'
        }}
      >
        Create advertisements
      </LoadingButton>
      </Container>
      
      
      
        <Box
          sx={{
            mt: 5,
            width: 1,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: {sx: 'center', sm: 'flex-start'},
            alignItems:{sx: 'center', sm: 'flex-start'},
            gap: 5,
            flexDirection: { xs: 'column', sm: 'row' },
            borderRadius: 2,
          }}
        >
          {advertisements.length > 0 ? (
            advertisements.map(({ id, title, image, link, type }: any) => !title && (
              <AdsCard 
              key={id}
              id={id}
              title={title}
              image={image}
              link={link}
              handleDelete={handleDelete}
              isHome={type === 'home'}
            />
            ))
          ) : (
            <Typography variant="body1" sx={{ py: 5, textAlign: 'center', width: '100%' }}>
              No advertisements found
            </Typography>
          )}
        </Box>
      
      <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
      <Box>
      <Typography variant="h4"> Search ads </Typography>
      <Typography sx={{
        fontSize: '14px',
        color: '#637381',
        letterSpacing: 0,
        fontWeight: 400
      }}>Ads placed between search results</Typography>
      </Box>
      <LoadingButton
        color="inherit"
        type="submit"
        variant="contained"
        startIcon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.16667 14.6667C7.16667 14.8877 7.25446 15.0996 7.41074 15.2559C7.56702 15.4122 7.77899 15.5 8 15.5C8.22101 15.5 8.43297 15.4122 8.58926 15.2559C8.74554 15.0996 8.83333 14.8877 8.83333 14.6667V8.83333H14.6667C14.8877 8.83333 15.0996 8.74554 15.2559 8.58926C15.4122 8.43297 15.5 8.22101 15.5 8C15.5 7.77899 15.4122 7.56702 15.2559 7.41074C15.0996 7.25446 14.8877 7.16667 14.6667 7.16667H8.83333V1.33333C8.83333 1.11232 8.74554 0.900358 8.58926 0.744078C8.43297 0.587797 8.22101 0.5 8 0.5C7.77899 0.5 7.56702 0.587797 7.41074 0.744078C7.25446 0.900358 7.16667 1.11232 7.16667 1.33333V7.16667H1.33333C1.11232 7.16667 0.900358 7.25446 0.744078 7.41074C0.587797 7.56702 0.5 7.77899 0.5 8C0.5 8.22101 0.587797 8.43297 0.744078 8.58926C0.900358 8.74554 1.11232 8.83333 1.33333 8.83333H7.16667V14.6667Z" fill="white"/>
          </svg>
          }
          onClick={() => {
            dispatch(changeIsHome(false))
            handleOpen();
          }}        sx={{
          height: '3em'
        }}
      >
        Create advertisements
      </LoadingButton>
      </Container>

      <Box
          sx={{
            mt: 5,
            width: 1,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: {sx: 'center', sm: 'flex-start'},
            alignItems:{sx: 'center', sm: 'flex-start'},
            gap: 5,
            flexDirection: { xs: 'column', sm: 'row' },
            borderRadius: 2,
          }}
        >
          {advertisements.length > 0 ? (
            advertisements.map(({ id, title, image, link, type }: any) => title && (
              <AdsCard 
              key={id}
              id={id}
              title={title}
              image={image}
              link={link}
              handleDelete={handleDelete}
              isHome={type === 'home'}

            />
            ))
          ) : (
            <Typography variant="body1" sx={{ py: 5, textAlign: 'center', width: '100%' }}>
              No advertisements found
            </Typography>
          )}
        </Box>
        <CreateAdDialog open={open} onClose={handleClose} handleSave={handleSave}/>
    </Container>
  );
}
