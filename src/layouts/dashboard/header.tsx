// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
// theme
import { bgBlur } from 'src/theme/css';
// hooks
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Logo from 'src/components/logo';
import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';
//
import { HEADER, NAV } from '../config-layout';
import { AccountPopover, NotificationsPopover } from '../_common';
import Label from 'src/components/label';
import { useAuthContext } from '@/auth/hooks';
import { usePathname } from 'next/navigation';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  onOpenNav?: VoidFunction;
};

export default function Header({ onOpenNav }: Props) {
  const theme = useTheme();

  const { user } = useAuthContext();

  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  const pathName = usePathname();

  const isProfile = pathName.includes('/dashboard/profile/store/');

  const renderContent = (
    <>
      {isProfile && (
        <Stack
          direction="row"
          alignItems="center"
          gap={0}
          sx={{
            position: 'absolute',
            left: 10,
            top: 15,
          }}
        >
          <Logo sx={{ mr: 2.5 }} />
          <Typography color={'primary.main'} variant="h5">
            AL KHAIL STORE
          </Typography>
        </Stack>
      )}
      {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

      {!lgUp && !isProfile && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}

      {user?.role.toLowerCase() === 'seller' && (
        <Label
          // color="info"
          sx={{
            ml: isProfile ? 30 : 1,
            backgroundColor: 'rgba(252, 231, 243, 1) !important',
            color: 'primary.main',
          }}
        >
          Merchant Dashboard
        </Label>
      )}
      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
      >
        <NotificationsPopover />

        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
        }),
        ...(isProfile && {
          width: 1,
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
          position: 'relative',
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
