import { Card, Stack, CardHeader, CardContent, Grid, TextField, Avatar, Button, FormControl, InputLabel, Select, MenuItem, InputAdornment, SelectChangeEvent } from '@mui/material';
import Iconify from 'src/components/iconify';
import { LoadingButton } from '@mui/lab';

interface StoreInformationProps {
  storeInfo: {
    logo: string;
    name: string;
    tagline: string;
    storeType: string;
    description: string;
    phoneNumber: string;
    businessHours: {
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
      sunday: string;
    };
    socialLinks: {
      instagram: string;
      facebook: string;
      tiktok: string;
    };
  };
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBusinessHoursChange: (day: string, value: string) => void;
  handleSocialLinkChange: any;
  handleStoreTypeChange: (event: SelectChangeEvent<string>) => void;
  handleSaveChanges: any;
  handleLogoChange: (file: File) => void;
  loading: boolean
}

const StoreInformation = ({
  storeInfo,
  handleInputChange,
  handleBusinessHoursChange,
  handleSocialLinkChange,
  handleStoreTypeChange,
  handleSaveChanges,
  handleLogoChange,
  loading
}: StoreInformationProps) => {
  
  return (
    <Stack spacing={3} >
      <Card sx={{ borderRadius: 2, position: 'relative' }} >
        <LoadingButton
        size="small"
        type="submit"
        sx={{p: 1.5, bgcolor: 'primary.main', position: 'absolute', top: 10, right: 10}}
        variant="contained"
        onClick={handleSaveChanges}
        loading={loading}
      >
        Save Changes
      </LoadingButton>
        <CardHeader title="Store Information" />
        <CardContent>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar src={storeInfo.logo} sx={{ width: 80, height: 80 }} />
              <input
                type="file"
                accept="image/*"
                id="logo-upload-input"
                style={{ display: 'none' }}
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    handleLogoChange(e.target.files[0]);
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={() => document.getElementById('logo-upload-input')?.click()}
              >
                Change Logo
              </Button>

            </Stack>

            <Grid container spacing={2}>
              <Stack width={'100%'} direction={"row"} alignItems={"center"} spacing={1} justifyContent={"space-between"}>
                <TextField
                  fullWidth
                  name="name"
                  label="Store Name"
                  value={storeInfo.name}
                  onChange={handleInputChange}
                />

                <TextField
                  fullWidth
                  name="tagline"
                  label="Tagline / Sub-headline"
                  value={storeInfo.tagline}
                  onChange={handleInputChange}
                />
                </Stack>
            </Grid>

            <Grid container spacing={2}>

                <Stack width={'100%'} direction={"row"} alignItems={"center"} spacing={1} justifyContent={"space-between"}>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  value={storeInfo.phoneNumber}
                  onChange={handleInputChange}
                />
                <FormControl fullWidth>
                  <InputLabel id="store-type-label">Store Type</InputLabel>
                  <Select
                    labelId="store-type-label"
                    value={storeInfo.storeType}
                    label="Store Type"
                    onChange={handleStoreTypeChange}
                  >
                    <MenuItem value="Retail Store">Retail Store</MenuItem>
                    <MenuItem value="Online Store">Online Store</MenuItem>
                    <MenuItem value="Service Provider">Service Provider</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>

                </Stack>
            </Grid>
            <Stack width={'100%'} direction={"row"} alignItems={"center"} spacing={1} justifyContent={"space-between"}>
                <TextField
                  fullWidth
                  name="description"
                  label="Store Description"
                  multiline
                  rows={4}
                  value={storeInfo.description}
                  onChange={handleInputChange}
                />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2 }}>
        <CardHeader title="Business Hours" />
        <CardContent>
          <Stack spacing={2}>
            {Object.entries(storeInfo.businessHours).map(([day, time]) => (
              <TextField
                key={day}
                fullWidth
                label={day.charAt(0).toUpperCase() + day.slice(1)}
                value={time}
                onChange={(e) => handleBusinessHoursChange(day, e.target.value)}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2 }}>
        <CardHeader title="Social Media Links" />
        <CardContent>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Instagram"
              value={storeInfo.socialLinks.instagram}
              onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="skill-icons:instagram" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Facebook"
              value={storeInfo.socialLinks.facebook}
              onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="logos:facebook" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="TikTok"
              value={storeInfo.socialLinks.tiktok}
              onChange={(e) => handleSocialLinkChange('tiktok', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="logos:tiktok-icon" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default StoreInformation;