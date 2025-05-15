'use client';

import { useEffect, useState } from 'react';

// @mui
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Pagination,
  Stack,
  Select,
  TextField,
  Typography,
  Avatar
} from '@mui/material';

// components
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAuthContext } from '@/auth/hooks';
import { fetchChats } from '@/redux/slices/ContactSlice';

// ----------------------------------------------------------------------

const TICKET_FILTERS = [
  { id: 'all', label: 'All Tickets', count: 24, icon: 'lucide:tickets' },
  { id: 'unassigned', label: 'Unassigned', count: 8, icon: 'zondicons:exclamation-solid' },
  { id: 'urgent', label: 'Urgent', count: 3, icon: 'clarity:flame-solid' },
  { id: 'resolved', label: 'Resolved', count: 156, icon: 'icon-park-solid:check-one' },
];

const mockTickets = [
  {
    id: '#2234',
    title: 'Order Delivery Issue',
    description: 'My order hasn\'t arrived yet and it\'s been 5 days...',
    status: 'pending',
    time: '2 hours ago',
    avatarUrl: '/assets/images/avatar/avatar_1.jpg',
  },
  {
    id: '#2233',
    title: 'Product Return Request',
    description: 'I received the wrong shade of foundation...',
    status: 'urgent',
    time: '4 hours ago',
    avatarUrl: '/assets/images/avatar/avatar_2.jpg',
  },
  {
    id: '#2232',
    title: 'Product Inquiry',
    description: 'Is this product suitable for sensitive skin?',
    status: 'resolved',
    time: 'Yesterday',
    avatarUrl: '/assets/images/avatar/avatar_3.jpg',
  },
];

// ----------------------------------------------------------------------

export default function ContactManagementView() {
  const settings = useSettingsContext();
  const {user} = useAuthContext()
  const {chats} = useAppSelector(state => state.contactManagement)
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const dispatch = useAppDispatch()

  const handleFilterChange = (filterId: string) => {
    setCurrentFilter(filterId);
    // Add filtering logic here
  };

  const getStatusLabelColor = (status: string) => {
    if (status === 'pending') return 'warning';
    if (status === 'urgent') return 'error';
    if (status === 'resolved') return 'success';
    return 'default';
  };

  useEffect(() => {
    if(user && user.id){
      dispatch(fetchChats(user.id))
    }
  }, [])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={5}>
        <Box>
          <Typography variant="h4">Contact Management</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: .5 }}>
            Manage customer inquiries and support tickets
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Iconify icon="pixel:plus-solid" width={14}/>}
          sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: '#FF308D' } }}
        >
          New Ticket
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <List disablePadding>
              {TICKET_FILTERS.map((filter) => (
                <ListItem
                  key={filter.id}
                  button
                  selected={currentFilter === filter.id}
                  onClick={() => handleFilterChange(filter.id)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    ...(currentFilter === filter.id && {
                      bgcolor: 'action.selected',
                      fontWeight: 'fontWeightBold',
                    }),
                  }}
                >
                  <Iconify icon={filter.icon} sx={{ mr: 2, color: currentFilter === filter.id ? 'primary.main' : 'text.secondary' }} />
                  <ListItemText primary={filter.label} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{filter.id === 'all'? chats?.length : filter.count}</Typography>
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <Card sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <TextField
                fullWidth
                size='small'
                variant="outlined"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                size="small"
                sx={{ minWidth: 180, ml: 2 }}
              >
                <MenuItem value="newest">Sort by: Newest</MenuItem>
                <MenuItem value="oldest">Sort by: Oldest</MenuItem>
                <MenuItem value="priority">Sort by: Priority</MenuItem>
              </Select>
            </Card>

            {mockTickets.map((ticket) => (
              <Card key={ticket.id} sx={{ p: 2 }}>
                <Stack direction="column" spacing={2} alignItems="flex-start" justifyContent={'center'} sx={{position: 'relative'}}>
                  <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent={'flex-start'}>
                  <Avatar src={ticket.avatarUrl} alt={ticket.title} />
                    <Stack direction="column" spacing={0} alignItems="flex-start" justifyContent={'center'}>
                      <Typography variant="subtitle1">
                          {ticket.title} {ticket.id}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                          {ticket.description}
                        </Typography>
                        <Stack mt={1} direction="row" alignItems="center" spacing={2}>
                        <Label color={getStatusLabelColor(ticket.status)} sx={{ textTransform: 'capitalize', borderRadius: 50}}>{ticket.status}</Label>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {ticket.time}
                        </Typography>
                      </Stack>

                      </Stack>
                    </Stack>
                    <IconButton sx={{position: 'absolute', top: 0, right: 0, opacity: 0.8}} size="small">
                      <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </Stack>
              </Card>
            ))}

            {/* Pagination */}
            <Stack alignItems="center" direction={'row'} justifyContent="space-between" mt={3}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Showing 1-3 of 24 tickets
              </Typography>
              <Pagination
                count={Math.ceil(24 / 3)}
                page={1}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#000', // Default number color
                    borderRadius: 1
                  },
                  '& .MuiPaginationItem-root.Mui-selected': {
                    color: '#fff',           // Selected number color
                  },
                }}
              />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
