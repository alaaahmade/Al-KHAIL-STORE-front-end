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
import axiosInstance from '@/utils/axios';
import { deleteFile, uploadFile } from '@/utils/s3.client';
import { useBoolean } from '@/hooks/use-boolean';
import { changeNewPlan, closeCreateDialog, deletePlan, fetchPlans, openCreateDialog, setEditMode, setError, setLadingB, setPlans } from '@/redux/slices/PlanSlice';
import { CreatePlanDialog } from 'src/components/custom-dialog/CreatePlanDialog';
import PlanCard from '../card';
// ----------------------------------------------------------------------


export function PlansView() {
  const settings = useSettingsContext();
  const dispatch = useAppDispatch();
  const newPlan = useSelector((state: any) => state.PlansSlice.newPlan)
  const editMode = useSelector((state: any) => state.PlansSlice.editMode);
  const plans = useSelector((state: any) => state.PlansSlice.plans);
  const refresh = useBoolean();
  const open = useSelector((state: any) => state.PlansSlice.open);

  const handleSave = async () => {
    try {
      const newErrors: any = {};

      if (!String(newPlan.name).trim()) {
        newErrors.name = 'Please enter a name for the Plan';
      }
  
      if (!String(newPlan.credits).trim()) {
        newErrors.credits = 'Please enter a credits for the Plan';
      }
  
      if (!String(newPlan.amountJOD).trim()) {
        newErrors.amountJOD = 'Please enter a amountJOD for the Plan';
      }      
      if (Object.keys(newErrors).length > 0) {
        dispatch(setError(newErrors));
        return;
      }
      dispatch(setLadingB(true));

      if(!editMode){        
          await axiosInstance.post('/subscriptions/create-monthly-plan', {
            credits: newPlan.credits,
            name: newPlan.name,
            amountJOD: newPlan.amountJOD,
          });
      refresh.onToggle()
    } else {
      console.log(editMode);
      
     const data =  await axiosInstance.put(`/subscriptions/plans/${editMode}`, {
        name: newPlan.name,
        credits: newPlan.credits,
        amountJOD: newPlan.amountJOD,
      });
      console.log(data);
      
      refresh.onToggle()    }
    dispatch(setPlans([]))
  
      dispatch(setLadingB(false));
      dispatch(closeCreateDialog());
      setError({});
      dispatch(setEditMode(undefined))
      dispatch(changeNewPlan({ value: '', field: 'name' }));
      dispatch(changeNewPlan({ value: '', field: 'credits' }));
      dispatch(changeNewPlan({ value: '', field: 'amountJOD' }));
      dispatch(changeNewPlan({ value: '', field: 'id' }));
  
    } catch (error) {
      dispatch(setLadingB(false));
      console.log(error);
      dispatch(setError(error.message));
    }
  }
  


  useEffect(() => {
    async function getAds() {      
      await dispatch(fetchPlans());
    }
    getAds();
  }, [refresh.value]);  
  const handleDelete =async (id: any) => {
    try {
      await dispatch(setLadingB(id));
      await dispatch(deletePlan(id));
      refresh.onToggle();
      
      } catch (error) {
        console.log(error);
        dispatch(setError(error.message));
      }
  }

  const handleClose = () => {
    dispatch(setLadingB(false));
    dispatch(changeNewPlan({ value: '', field: 'name' }));
    dispatch(changeNewPlan({ value: '', field: 'credits' }));
    dispatch(changeNewPlan({ value: '', field: 'amountJOD' }));
    dispatch(changeNewPlan({ value: '', field: 'id' }));
    dispatch(closeCreateDialog());
  }




  const handleOpen = () => {
    dispatch(openCreateDialog());
  }

  console.log(plans);
  
  

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} >
      <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box>
      <Typography variant="h4"> Subscriptions monthly plans </Typography>
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
        Create Plans
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
          {Array.isArray(plans) && plans?.length > 0 ? (
            plans.map(({ id, name, credits, amountJOD }: any) => (
              <PlanCard 
              key={id}
              id={id}
              name={name}
              credits={credits}
              amountJOD={amountJOD}
              handleDelete={handleDelete}
            />
            ))
          ) : (
            <Typography variant="body1" sx={{ py: 5, textAlign: 'center', width: '100%' }}>
              No Plans found
            </Typography>
          )}
        </Box>

        <CreatePlanDialog open={open} onClose={handleClose} handleSave={handleSave}/>
    </Container>
  );
}
