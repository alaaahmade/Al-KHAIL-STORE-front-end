import React, { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import { m } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers';
// utils
import { fDate } from 'src/utils/format-time';
// _mock
// components
import Image from 'src/components/image';
import { Button, Rating, SelectChangeEvent } from '@mui/material';
import { fShortenNumber } from 'src/utils/format-number';
import { MultipleSelect } from 'src/components/inputs';
import OrderListView from './table/view/table-list-view';
import ProductDetailsReview from './reviws-details-review';

// ----------------------------------------------------------------------


export default function TourDetailsContent({service}: any) {
  const {
    title,
    credits,
    images,
    hours,
    description,
    totalRating,
    totalReviews,
    availability

  } = service;

  const [KindOfServiceDate, setKindOfServiceDate] = useState<string>('');
  const [currentDay, setCurrentDay] = useState<string>(service?.availability?.days[0]?.day || '');

  const [SpecificData, setSpecificData] = useState<Date>(new Date())
  


  const handleChange = (event: SelectChangeEvent<typeof KindOfServiceDate>) => {
    const {
      target: { value },
    } = event;
    setKindOfServiceDate(
       value,
    );
  };  
  const renderDetails = (
      <Stack alignItems='center' justifyContent='space-between' sx={{ mb: 3,width: '100%', flexDirection: { xs: 'column', md: 'row', sm: 'row' } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '70%',
            flexDirection: 'column',
            gap: 2.5
          }}
        >
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
         {title}
        </Typography>
        
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        color: 'text.disabled',
        typography: 'body2',
      }}
    >
      <Rating size="small" value={totalRating} precision={0.1} readOnly sx={{ mr: 1 }} />
      {`(${fShortenNumber(totalReviews)} reviews)`}
    </Stack>

    <Typography variant='h5' sx={{ flexGrow: 1 }}>
      {fShortenNumber(credits)} Credits
    </Typography>

        <Typography variant="body2" sx={{ flexGrow: 1, opacity: .7, lineHeight: '22px', letterSpacing: 0, fontSize: '14px' }}>
          {description}
        </Typography>

        </Box>
        <Image src={images[0]} alt="Service image" width={400} height={300} responsive ratio="1/1" sx={{ borderRadius: 2 }} />
      </Stack>
      

  );

  const renderAvailability = (
    <Box
      gap={3}
      sx={{
      }}
    >
      {availability?.days?.length>0 && (
        <>
          <Typography sx={{
            fontSize: '18px',
            mb: 2.5
          }}>Availability</Typography>
          <Typography variant="body2" sx={{  lineHeight: '22px', letterSpacing: 0, fontSize: '14px' }}>
            {availability?.days?.map((day: { day: boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | Key | null | undefined; from: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; to: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }) => (
              <Typography key={`${day.day}-${day.from}-${day.to}`} sx={{ mb: 1, display: 'flex', gap: 3, width: 1 , fontWeight: 600, fontSize: '14px'}}>
                <span>{day.day}</span> <span>{day.from} - {day.to}</span>
              </Typography>
            ))}
          </Typography>
        </>
      ) }

      {
        availability?.classes?.length>0 && (
          <>
          <Typography sx={{
            fontSize: '18px',
            mb: 2.5
          }}>Availability</Typography>
          <Typography variant="body2" sx={{  lineHeight: '22px', letterSpacing: 0, fontSize: '14px' }}>
            {availability.classes.map((day: {
              sessions: any; day: boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | Key | null | undefined; from: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; to: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; 
}) => (
              <Typography key={`${day.day}-${day.from}-${day.to}`} sx={{ mb: 1, display: 'flex', gap: 3, width: 1 , fontWeight: 600, fontSize: '14px'}}>
                <span>{day.day}</span> {day.sessions.map((session: any) => (
                  <span key={`${session.from}-${session.to}`}>
                  {session.from} - {session.to}
                </span>
                ))}
              </Typography>
            ))}
          </Typography></>
        )}
      
    </Box>
  );


  const renderAttendance = (
      <Stack spacing={2}>
        <Typography variant="h6">Attendance</Typography>

        <Box
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3
            }}
          >
          <MultipleSelect options={['Upcoming activities', 'Specific date']} lapel='View' handleChange={handleChange} valu={KindOfServiceDate}  />
          {KindOfServiceDate === 'Specific date' && 
          <DatePicker
      label="Controlled picker"
      value={SpecificData}
      onChange={(newValue) => setSpecificData(newValue || new Date())}
      sx={{
        width: .3
      }}
/>
}
          </Box>
          {KindOfServiceDate === 'Specific date' ? (

            <Typography sx={{m: 2, borderBottom:' 2px solid #000', width : 'fit-content'}}>{fDate(SpecificData)}</Typography>

          ): <>
            <Box
              sx={{
                desplay: 'flex',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                mt: 3
              }}
            >
              {service.availability.days.length > 0 && service.availability.days.map((day: any, index: number) => 
                <Button
                  key={`${day.day}-${index}`}
                  sx={{
                    width: '155px',
                    fontSize: '14px',
                    lineHeight: '22px',
                    letterSpacing: 0,
                    borderBottom: currentDay === day.day ?  '2px solid #000' : '0px solid #000',
                    borderRadius: 0,
                    fontWeight: 400
                  }}
                  onClick={()=> setCurrentDay(day.day)}
                >{day.day} {day.from} - {day.to}</Button> )} 

              {service.availability.classes.length > 0 && service.availability.classes.map((day: any, index: number) => 
                <Button
                  key={`${day.day}-${index}`}
                  sx={{
                    width: '155px',
                    fontSize: '14px',
                    lineHeight: '22px',
                    letterSpacing: 0,
                    borderBottom: currentDay === day.day ?  '2px solid #000' : '0px solid #000',
                    borderRadius: 0,
                    fontWeight: 400
                  }}
                  onClick={()=> setCurrentDay(day.day)}
                >{day.day} </Button> )} 
            </Box>
            <Box/>
          </>}
          
        </Box>
        <OrderListView />
      </Stack>
  );

  const renderReview = (
    <ProductDetailsReview
    ratings={service.ratings}
    reviews={service.reviews}
    totalRatings={service.totalRating}
    totalReviews={service.totalReviews}
  />
  ) 

  return (
    <>
      {/* {renderGallery} */}

      <Stack sx={{  mx: 'auto' }}>
        {renderDetails}

        {renderAvailability}


        <Divider sx={{ borderStyle: 'dashed', my: 3 }} />

        {renderAttendance}
        {renderReview}
      </Stack>
    </>
  );
}


