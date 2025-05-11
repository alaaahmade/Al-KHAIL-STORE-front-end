'use client';

// @mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import { LoadingButton } from '@mui/lab';
import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { LoadingScreen } from 'src/components/loading-screen';
// import { gitInterests, setInterests, setError, setIsLoading } from 'src/redux/slices/InterestsSlice';
import { useDispatch } from 'react-redux';
import { closeCreateDialog, openCreateDialog, setInterests, setError, setIsLoading, setLadingB, gitInterests, changeNewInterest } from 'src/redux/slices/InterestsSlice';
import axiosInstance from 'src/utils/axios';
import { deleteFile, uploadFile } from 'src/utils/s3.client';
import { CreateInterestDialog } from 'src/components/custom-dialog/createInterestDialog';
import CatCard from '../card';
// ----------------------------------------------------------------------

export function InterestsView() {
  const settings = useSettingsContext();

  const dispatch = useDispatch();

  const interests = useSelector((state: any) => state.InterestsSlice.interests);
  const  [refresh, setRefresh] = useState<boolean>(false);
  const lading = useSelector((state: any) => state.InterestsSlice.isLoading);
  const open = useSelector((state: any) => state.InterestsSlice.open);
  const editMode = useSelector((state: any) => state.InterestsSlice.editMode);
  const newInterest = useSelector((state: any) => state.InterestsSlice.newInterest);

  const handleOpen = () => {
    dispatch(openCreateDialog());
  };
  const handleClose = () => {
    dispatch(closeCreateDialog());
  };

  const handleSave = async () => {
    try {
      const newErrors: any = {};

      if (!newInterest.name.trim()) {
        newErrors.name = 'Please enter a name for the Interest';
      }
  
      if (!newInterest.image) {
        newErrors.image = 'Please upload an icon for the Interest';
      }
  
      if (!newInterest.description.trim()) {
        newErrors.description = 'Please enter a description for the Interest';
      }
  
      if (Object.keys(newErrors).length > 0) {
        dispatch(setError(newErrors));
        return;
      }
      dispatch(setLadingB(true));
      let url;
      const iconFile = newInterest.image;
  
      if (iconFile) {
        
        if (typeof iconFile === 'string') {
          url = iconFile;
        }else {

          const mimeType = iconFile.type;
          const fileBuffer = Buffer.from(await iconFile.arrayBuffer());
    
          url = await uploadFile(fileBuffer, `interests/${iconFile.name + Date.now()}`, mimeType);
    
          await dispatch(changeNewInterest({ value: url, field: 'image' }));
    
          if (editMode) {
            await deleteFile('iconFile');
          }
    
        }
      }
      if(!editMode){
      await axiosInstance.post('/interests', {
        name: newInterest.name,
        image: url  || newInterest.image,
        description: newInterest.description,
      });
      setRefresh((prev) => !prev);
    } else {      
      await axiosInstance.patch(`/interests/${editMode}`, {
        name: newInterest.name,
        image: url  || newInterest.image,
        description: newInterest.description,
      });
      setRefresh((prev) => !prev);
    }
      
      // setInterests((prevInterests: any) => [...prevInterests, data]);
      dispatch(setLadingB(false));
      dispatch(changeNewInterest({ value: '', field: 'name' }));
      dispatch(changeNewInterest({ value: '', field: 'image' }));
      dispatch(changeNewInterest({ value: '', field: 'description' }));
      dispatch(changeNewInterest({ value: '', field: 'id' }));

      dispatch(closeCreateDialog());
  
    } catch (error) {
      dispatch(setLadingB(false));
      console.log(error);
      dispatch(setError(error.message));
    }
  };
  
  // console.log(interests);

  useEffect(() => {
    async function fetchData() {
      dispatch(setIsLoading(true));
      try {
        const data = await gitInterests();                
        dispatch(setIsLoading(false));
        dispatch(setInterests(data.interests));

      } catch (error) {
        dispatch(setError(error.message));
      }
    }
    fetchData();
  }, [refresh]);  


  if (lading) return<LoadingScreen/>

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} >
      <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box>
      <Typography variant="h4"> Interests </Typography>

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
          handleOpen();
        }}
        sx={{
          height: '3em'
        }}
      >
        Create Interest
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
        {Array.isArray(interests) && interests.length > 0 ? (
          interests.map(({ id, name, image, description }) => (
            <CatCard 
              key={id}
              id={id}
              name={name}
              image={image}
              description={description}
            />
          ))
        ) : (
          <Typography variant="body1" sx={{ py: 5, textAlign: 'center', width: '100%' }}>
            No interests found
          </Typography>
        )}
        </Box>
        <CreateInterestDialog open={open} onClose={handleClose} handleSave={handleSave}/>
    </Container>
  );
}
