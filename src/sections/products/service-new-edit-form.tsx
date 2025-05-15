/* eslint-disable react-hooks/exhaustive-deps */
import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, Key } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { WEEKDAY_OPTIONS } from 'src/_mock';

import { useSnackbar } from 'src/components/snackbar';
import dayjs from 'dayjs';
import FormProvider, {
  RHFUpload,
  RHFTextField,
} from 'src/components/hook-form';
//
import { CreateServiceDto, ListingInterface, UpdateServiceDto } from 'src/types/services';
import { Box, ButtonBase, FormControl, InputLabel, MenuItem, Paper, Select } from '@mui/material';
import Iconify from 'src/components/iconify';

import { RHFMultiCheckbox } from 'src/components/hook-form/rhf-checkbox';
import { TimePicker, DatePicker } from '@mui/x-date-pickers';
import { createService, updateService } from 'src/redux/slices/serviceSlice';
import { useAppDispatch } from 'src/redux/hooks';
import  { deleteFile, uploadFile } from 'src/utils/s3.client';
import { useSelector } from 'react-redux';
import axiosInstance from '@/utils/axios';
import { gitCategories, setCategories } from 'src/redux/slices/CategoriesSlice';

// ----------------------------------------------------------------------

type Props = {
  currentService?: ListingInterface;
};

const getDayName = (abbreviation: 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'): string  => {
  const days = {
    Sun: 'Sunday',
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
  };

  return days[abbreviation];
}

export default function ServiceNewEditForm({ currentService }: Props) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();

  const categories = useSelector((state: any) => state.CategoriesSlice.categories);
  
  const NewBlogSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    image: Yup.mixed<any>().nullable().required('Image is required'),
    type: Yup.string().required('Type is required'),
    class: Yup.boolean(),
    availability: Yup.object({
      days: Yup.array().of(
        Yup.object({
          value: Yup.mixed(),
          day: Yup.string().required(),
          from: Yup.string().required(),
          to: Yup.string().required(),
        })
      ),
      classes: Yup.array().of(
        Yup.object({
          day: Yup.string().required(),
          value: Yup.mixed(),
          sessions: Yup.array().of(
            Yup.object({
              from: Yup.string().required(),
            })
          ),
        })
      ),
    }).required('Availability is required'),
    credit: Yup.mixed().required('Price is required'),
    availability_days: Yup.array().required('Availability is required'),
    isFuture: Yup.boolean(),
    file: Yup.mixed<File>().nullable(),
    date: Yup.mixed<any>()
  });

  const defaultValues = useMemo(
    () => ({
      name: currentService?.title || '',
      description: currentService?.description || '',
      category: currentService?.category || '',
      image: currentService?.images?.[0] || '',
      type: currentService?.type || (currentService?.class ? 'class' : 'session'),
      class: currentService?.class || false,
      availability: {
        days: currentService?.availability?.days || [],
        classes: currentService?.availability?.classes || [],
      },
      credit: currentService?.credits || 0,
      availability_days: currentService?.availability?.days?.map((item) => item.day.slice(0, 3)) || 
      currentService?.availability?.classes?.map((item) => item.day.slice(0, 3)) || [],
      isFuture: currentService?.isFuture || false,
      file: null as File | null,
      date: currentService?.date || null
    }),
    [currentService]
  );  

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;  

  const values = watch();

  useEffect(() => {
    if (currentService) {
      reset(defaultValues);
    }
  }, [currentService, defaultValues, reset]);

  useEffect(() => {
    if (currentService?.availability) {
      // Initialize availability days
      if (currentService.availability.days?.length) {
        setValue('availability_days', currentService.availability.days.map(day => day.day.slice(0, 3)));
      }
    
      
      // Set the type based on the service data
      setValue('type', currentService.type || (currentService.class ? 'class' : 'session'));
      
      // If it's a class type, make sure we initialize the class data correctly
      if (currentService.type === 'class' || currentService.class) {
        // Make sure we have the class days selected in availability_days
        const classDays = currentService.availability.classes?.map(c => c.day.slice(0, 3)) || [];
        
        if (classDays.length) {
          setValue('availability_days', classDays);
        }
      }
    }
    
  }, [currentService, setValue]);

  useEffect(() => {
    async function getCategories() {
      try {        
        const data = await gitCategories();
        dispatch(setCategories(data));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    getCategories();
  }, [currentService]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Format availability data correctly based on API requirements
      let formattedAvailability;
      
      if (data.type === 'class') {
        formattedAvailability = {
          class: data.availability.classes
        };
      } else {
        // For Session type, only include days
        formattedAvailability = {
          days: data.availability_days.map(day => {
            // Find the day in the availability.days array
            const dayData = (data.availability.days ?? []).find(d => d.day.slice(0, 3) === day);
            // Return only the properties the API expects (no id property)
            return {
              day,
              value: day,
              from: dayData?.from || '09:00',
              to: dayData?.to || '17:00',
            };
          })
        };
      }
      let url = null

      if (data.file){
        const mimeType = data.file.type;
        const fileBuffer = Buffer.from(await data.file.arrayBuffer());
        url = await uploadFile(fileBuffer, `service/${data.file.name}`, mimeType);
        if(currentService?.id){
          await deleteFile(currentService.images[0]);
        }
      }


      // Transform form data to match API expectations
      const serviceData = {
        title: data.name,
        description: data.description,
        credits: Number(data.credit),
        category: data.category,
        availability: formattedAvailability,
        images: url ? [url] : [data.image],
        publish: true,
        isFuture: data.isFuture,
        class: data.type === 'class',
        type: data.type,
      };
      
      if (currentService?.id) {
        await dispatch(updateService({ 
          id: currentService.id, 
          data: serviceData as UpdateServiceDto
        })).unwrap();
        enqueueSnackbar('Service updated successfully!', { variant: 'success' });
      } else {
        await dispatch(createService(serviceData as unknown as CreateServiceDto)).unwrap();
        enqueueSnackbar('Service created successfully!', { variant: 'success' });
      }
      
      router.push(paths.dashboard.service.root);
    } catch (error: any) {
      console.error(error);
      enqueueSnackbar(error.message || 'Failed to save service', { variant: 'error' });
    }
  });

  const handleChangeSessionTime = (day: string, timeType: 'from' | 'to', newTime: Date) => {
    const formattedTime = dayjs(newTime).format('HH:mm');
  
    const currentDays = [...(values.availability?.days || [])];
  
    const dayIndex = currentDays.findIndex((d) => d.day === day);
  
    if (dayIndex !== -1) {
      currentDays[dayIndex] = {
        ...currentDays[dayIndex],
        [timeType]: formattedTime,
      };
  
      setValue('availability.days', currentDays);
    }
  };
  

  const handleDrop = useCallback(
    async(acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('image', newFile, { shouldValidate: true });
        setValue('file', file);
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('image', '');
  }, [setValue]);

  const handleChangeTime = (day: string, sessionIndex: number, timeType: 'from' | 'to', newTime: Date) => {
    const formattedTime = dayjs(newTime).format('HH:mm');
    
    // Get the current availability class data
    const currentClass = [...(values.availability.classes || [])];
    
    // Find the day in the class data
    const dayIndex = currentClass.findIndex(item => item.day === day);
    
    if (dayIndex !== -1) {
      // Update the session time
      const updatedSessions = [...(currentClass[dayIndex].sessions || [])];
      updatedSessions[sessionIndex] = {
        ...updatedSessions[sessionIndex],
        [timeType]: formattedTime
      };
      
      // Update the class data
      const updatedClass = [...currentClass];
      updatedClass[dayIndex] = {
        ...updatedClass[dayIndex],
        sessions: updatedSessions
      };
      
      // Set the updated class data in the form
      setValue('availability.classes', updatedClass);
    } else {
      // If the day doesn't exist in the class data, create it
      const newClass = {
        day,
        sessions: [{
          from: timeType === 'from' ? formattedTime : '09:00',
          to: timeType === 'to' ? formattedTime : '17:00'
        }]
      };
      
      // Add the new class data to the form
      setValue('availability.classes', [...currentClass, newClass]);
    }
  };

  const handleAddSession = (day: string) => {
    const updatedAvailability = (values.availability?.classes as unknown as any[])?.map((item) => {
      if (item.day === day) {
        item.sessions.push({ from: '10:00', to: '12:00' });
      }
      return item;
    });
    
    setValue('availability.classes', (updatedAvailability as any));
  };

  const handleAvailabilityDays = () => {
    const defaultTime = {
      from: '10:00',
      to: '12:00',
    };
  
    const days = values.availability_days;
    const {availability} = values;    
    if (values.type === 'session') {
      // Ensure availability.days is an array
      const updatedAvailability = (availability.days || []).filter((item) => days.includes(item.day));
      // Add new days that are in the `days` array but not in the current availability
      const newDays = days
        .filter((day) => !updatedAvailability.some((item) => item.day === day))
        .map((day) => ({
          day,
          value: day,
          ...defaultTime,
        }));        
  
      const updatedAvailabilityDays = [...updatedAvailability, ...newDays];
  
      setValue('availability.days', updatedAvailabilityDays);
    } else if (values.type === 'class') {
      // Ensure availability.class is an array
      const updatedAvailabilityClass = ((availability?.classes as unknown as any[]) || []).map((item) => {
        if (days.includes(item.day)) {
          return item;
        }
        return null;
      }).filter(Boolean);      
  
      // Add new days for 'Class' type
      const newClassDays = days
      .filter((day) => !updatedAvailabilityClass.some((item) => item.day === day))
      .map((day) => {
        const originalDay = currentService?.availability?.classes?.find((c) => c.day.slice(0, 3) === day);
        return {
          day,
          sessions: originalDay?.sessions?.map(s => ({ from: s.from, to: s.to })) || [{ from: '10:00', to: '12:00' }],
        };
      });
      // Now safely update availability.class
      const updatedAvailabilityClassDays = [...updatedAvailabilityClass, ...newClassDays];
  
      setValue('availability.classes', (updatedAvailabilityClassDays as any));
    }
  };
  


  useEffect(() => {
    handleAvailabilityDays();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.availability_days]);


  const handleRemoveSession = (day: string, sessionIndex: number) => {
    const updatedAvailability = (values.availability?.classes as unknown as any[])?.map((item) => {
      if (item.day.slice(0, 3) === day) {
        item.sessions.splice(sessionIndex, 1);
      }
      return item;
    });
    
    setValue('availability.classes', (updatedAvailability as any));
  };

  useEffect(() => {
    if (values.type === 'class') {
      setValue('availability', { days: [], classes: (currentService?.availability?.classes || [] as any) });
      setValue('availability_days', ((currentService?.availability?.classes as unknown as any) || [])?.map((item: any) => item.day.slice(0,3)) || [])
    } else {
      setValue('availability', { days: currentService?.availability?.days || [], classes: [] as any });
      setValue('availability_days', currentService?.availability?.days.map((item) => item.day.slice(0,3)) || [])
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentService?.availability, values.type]);

  // Add this function to handle class sessions display and editing
  const handleClassSessions = useCallback(() => {
    if (currentService?.availability?.classes && values.type === 'class') {
      // Map the classes from the API to the format expected by the form
      const classData = currentService.availability.classes.map(classItem => ({
        day: classItem.day.slice(0, 3),
        sessions: classItem.sessions.map(session => ({
          from: session.from,
          to: session.to
        }))
      }));
      
      // Set the class data in the form      
      setValue('availability.classes', classData);
      
      // Make sure the days are selected in availability_days
      const classDays = classData.map(item => item.day);
      setValue('availability_days', classDays);
      
    }
  }, [currentService, setValue, values.type]);

  // Call this function when the component mounts and when the type changes
  useEffect(() => {
    handleClassSessions();
  }, [handleClassSessions, currentService, values.type]);

  const renderDetails = (
      <Grid xs={12} md={12}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Service Name" />
            <RHFTextField name="description" label="Description" multiline rows={3} />

              <FormControl  fullWidth>

              <InputLabel id="Category-simple-select-label">Category</InputLabel>
              <Select
                
                labelId="Category-simple-select-label"
                id="Category-simple-select"
                label="Category"
                name="category"
                value={values.category}
                onChange={(event) => setValue('category', event.target.value)}
              >
                {categories.length > 0 && categories.map((category: any) => (
                  <MenuItem key={category._id} value={category?.name}>{category?.name}</MenuItem>
                ))}
              </Select>
              </FormControl>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Image</Typography>
              <RHFUpload
                name="image"
                maxSize={3145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
  );


  console.log(categories);
  

  const renderProperties = (
    <Grid xs={12} md={12}>
        <Card>
          <CardHeader title="Type" />
          <Stack spacing={2} sx={{ p: 3 }}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Box gap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
                  {[
                    {
                      label: 'session',
                      icon: <Iconify icon="solar:clock-circle-bold" width={32} sx={{ mb: 2 }} />,
                      description: 'Book individual sessions with flexible availability',
                      details: 'Set daily time slots and credits'
                    },
                    {
                      label: 'class',
                      icon: <Iconify icon="solar:calendar-date-bold" width={32} sx={{ mb: 2 }} />,
                      description: 'Schedule recurring group classes',
                      details: 'Set class schedule and capacity'
                    },
                  ].map((item) => (
                    <Paper
                      component={ButtonBase}
                      variant="outlined"
                      key={item.label}
                      onClick={() => field.onChange(item.label)}
                      sx={{
                        p: 2.5,
                        borderRadius: 1,
                        typography: 'subtitle2',
                        flexDirection: 'column',
                        ...(item.label === field.value && {
                          borderWidth: 3,
                          borderColor: 'text.primary',
                        }),
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </Paper>
                  ))}
                </Box>
              )}
            />
          </Stack>

          {values.type === 'session' ? (
            <Stack spacing={3} sx={{ p: 3 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2">Availability</Typography>
                <RHFMultiCheckbox
                  name="availability_days"
                  options={WEEKDAY_OPTIONS}
                  // selected={values.availability_days}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 3,
                  }}
                />
              </Stack>

              {(values.availability?.days ?? []).length > 0 && (values.availability?.days ?? []).map((day) => (
                   <Box
                   key={day.day}
                        columnGap={2}
                        rowGap={3}
                        display="grid"
                        gridTemplateColumns={{
                          xs: 'repeat(2, 1fr)',
                          md: '1fr 2fr 2fr',
                       }}>
                  <Typography sx={{ mr: 5 }} variant="subtitle2">
                    {day.day}
                  </Typography>
                  <TimePicker
                    ampm={false} 
                    onChange={(newValue) => handleChangeSessionTime(day.day, 'from', newValue!)}
                    value={day.from ? dayjs(`0000 ${day.from}`, 'HH:mm').toDate() : null}
                    label="From" 
                  />
                  <TimePicker
                    ampm={false}
                    value={day.to ? dayjs(`0000 ${day.to}`, 'HH:mm').toDate() : null}
                    // onChange={(value) => handleChangeTime(day.day, 0, 'to', value || new Date())}
                    label="To" 
                    onChange={(newValue) => handleChangeSessionTime(day.day, 'to', newValue!)}

                  />
                </Box>
              ))}
            </Stack>
          ) : (
            <Stack spacing={3} sx={{ p: 3 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2">Class</Typography>
              </Stack>
              <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <Button
                sx={{
                  width: '155px',
                  fontSize: '14px',
                  lineHeight: '22px',
                  letterSpacing: 0,
                  borderBottom: !values.isFuture ?  '2px solid #000' : '0px solid #000',
                  borderRadius: 0,
                  fontWeight: 400
                }}
                onClick={()=> setValue('isFuture', false)}
              >Current</Button>
              <Button
                sx={{
                  width: '155px',
                  fontSize: '14px',
                  lineHeight: '22px',
                  letterSpacing: 0,
                  borderBottom: values.isFuture ?  '2px solid #000' : '0px solid #000',
                  borderRadius: 0,
                  fontWeight: 400
                }}
                onClick={()=> setValue('isFuture', true)}
              >Future Update</Button>
                </Box>
                {values.isFuture &&
                 <DatePicker
                 name='date'
                 label="Starting from"
                 maxDate={new Date()}
                 openTo="day"
                 views={['day','year', 'month']}
                 yearsOrder="desc"
                 onChange={(date) => setValue('date', date)}
                 sx={{ minWidth: 250 }}
               />
} 
              <RHFMultiCheckbox
                  name="availability_days"
                  options={WEEKDAY_OPTIONS}
                  selectedDays={values.availability_days}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 3,
                  }}
                />

              {values.type === 'class' && (
                <Stack spacing={3} sx={{ pt: 3 }}>
                  <Typography variant="subtitle1">Class Sessions</Typography>
                  
                  {values.availability_days.map(day => {
                    // Find the class data for this day
                    const classData = (values.availability.classes || []).find(c => c.day === day);
                    
                    return (
                      <Stack spacing={2} key={day}>
                        <Typography variant="subtitle2">{getDayName(day as any)}</Typography>
                        
                        {classData && classData.sessions && classData.sessions.map((session, sessionIndex) => (
                          <Box
                            key={sessionIndex}
                            columnGap={2}
                            rowGap={3}
                            display="grid"
                            gridTemplateColumns={{
                              xs: 'repeat(2, 1fr)',
                              md: '2fr 2fr 1fr',
                            }}
                          >
                            <TimePicker
                              ampm={false}
                              value={dayjs(`0000 ${session.from}`, 'HH:mm').toDate()}
                              onChange={(value) => handleChangeTime(day, sessionIndex, 'from', value || new Date())}
                              label="From"
                            />
                            <TimePicker
                              ampm={false}
                              value={dayjs(`0000 ${(session as { from: string; to?: string }).to || '17:00'}`, 'HH:mm').toDate()}
                              onChange={(value) => handleChangeTime(day, sessionIndex, 'to', value || new Date())}
                              label="To"
                            />
                            <Button
                              color="error"
                              onClick={() => handleRemoveSession(day, sessionIndex)}
                            >
                              <Iconify icon="solar:trash-bin-trash-bold" />
                            </Button>
                          </Box>
                        ))}
                        
                        <Button 
                          sx={{ width: 'fit-content', backgroundColor: '#919EAB14', border: 0 }} 
                          variant="outlined" 
                          onClick={() => handleAddSession(day)}
                        >
                          <Iconify icon="eva:plus-fill" sx={{ ml: 1 }} />
                          Add Session
                        </Button>
                      </Stack>
                    );
                  })}
                </Stack>
              )}
            </Stack>
          )}
        </Card>

        <Card sx={{ mt: 3 }}>
          <CardHeader title="Credits" />      
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  gap: 3,
                }}
              >
                <RHFTextField
                  type='number'
                  name="credit" 
                  label="Credits" 
                  value={values.credit || ''} 
                  onChange={(event) => {
                    setValue('credit', Number(event.target.value));
                  }}  
                />
                <Typography variant="subtitle2">Credits</Typography>
              </Box>
            </Stack>
          </Stack>
        </Card>
      </Grid>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentService ? 'Create Service' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}
        {renderProperties}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}
