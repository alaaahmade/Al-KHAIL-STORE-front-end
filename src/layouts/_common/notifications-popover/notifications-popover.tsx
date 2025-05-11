'use client';

import { m } from 'framer-motion';

import IconButton from '@mui/material/IconButton';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// _mock
// components
import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
//
import { useDispatch } from 'react-redux';
import { openNotificationsDialog } from 'src/redux/slices/notificationSlice';
import NotificationDialog from 'src/components/custom-dialog/NotificationDialog';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const drawer = useBoolean();

  const dispatch = useDispatch();



  return (
<>
<IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        sx={{
          fontSize: '16px',
          color: '#00A919',
          fontWeight: 'bolder',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          gap: 1,
          border: '1px solid #00A9197A',
          borderRadius: 1,
          pl: 1.5,
          pr: 1.5,
        }}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        onClick={() => {
          dispatch(openNotificationsDialog())
        }}
      >
          <Iconify color='#00A919' icon="solar:bell-bing-bold-duotone" width={24} />
        Send Notification
      </IconButton>
      <NotificationDialog/>
      </>

  );
}
