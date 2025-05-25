/*
  ProductNewEditForm: Create/Edit Product Form
  - Fields match backend Product entity
  - Supports both create and edit modes
  - Uses Material-UI and react-hook-form
*/

import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'src/routes/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import {
  Card,
  Stack,
  Grid,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Box,
  FormControlLabel
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import FormProvider, { RHFTextField, RHFUpload } from 'src/components/hook-form';
import ProductFormSectionTitle from './ProductFormSectionTitle';
import { CustomFile } from '@/components/upload';
import { fetchCategories } from '@/redux/slices/serviceSlice';
import { useAuthContext } from '@/auth/hooks';
import { uploadFile } from '@/utils/s3.client';
import axiosInstance from '@/utils/axios';

// TODO: Replace with actual redux actions
// import { createProduct, updateProduct } from 'src/redux/slices/productSlice';

// const categories = useSelector((state: any) => state.CategoriesSlice.categories);
// const stores = useSelector((state: any) => state.StoreSlice.stores);

const ProductSchema = Yup.object().shape({
  productName: Yup.string().required('Product name is required'),
  productImage: Yup.string().required('Product image is required'),
  productStatus: Yup.string().required('Status is required'),
  standardPrice: Yup.number()
    .typeError('Standard price is required')
    .required('Standard price is required'),
  offerPrice: Yup.number().nullable(),
  productDescription: Yup.string().required('Description is required'),
  productDate: Yup.date().required('Date is required'),
  productQuantity: Yup.number()
    .typeError('Quantity is required')
    .required('Quantity is required'),
  isFeatured: Yup.boolean().required(),
  productGallery: Yup.array().of(Yup.string()).required(),
  category: Yup.array().of(Yup.string()).min(1, 'Select at least one category').required(),
});

export type ProductFormValues = {
  productName: string;
  productImage: string;
  productStatus: string;
  standardPrice: number;
  offerPrice: number | null;
  productDescription: string;
  productDate: Date;
  productQuantity: number;
  isFeatured: boolean;
  productGallery: string[];
  category: string[];
};

type Props = {
  currentProduct?: any;
};

const PRODUCT_STATUS_OPTIONS = ['active', 'inactive', 'draft'];

export default function ProductNewEditForm({ currentProduct }: Props) {
  const router = useRouter();
  const {categories} = useAppSelector(state => state.serviceSlice);
  const [mainImage, setMainImage] = useState<any>(null);
  type GalleryImage = { file: File; preview: string };
const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
const {user} = useAuthContext()
  

  console.log(currentProduct);
  

  const defaultValues: ProductFormValues = {
    productName: currentProduct?.productName || '',
    productImage: currentProduct?.productImage || '',
    productStatus: currentProduct?.productStatus || 'active',
    standardPrice: currentProduct?.standardPrice ?? undefined,
    offerPrice:
    typeof currentProduct?.offerPrice === 'number'
      ? currentProduct.offerPrice
      : typeof currentProduct?.offerPrice === 'string'
        ? Number(currentProduct.offerPrice)
        : null,    productDescription: currentProduct?.productDescription || '',
    productDate: currentProduct?.productDate ? dayjs(currentProduct.productDate).toDate() : new Date(),
    productQuantity: currentProduct?.productQuantity ?? undefined,
    isFeatured: currentProduct?.isFeatured ?? true,
    productGallery: Array.isArray(currentProduct?.productGallery) ? currentProduct.productGallery.filter((v): v is string => typeof v === 'string') : [],
    category: Array.isArray(currentProduct?.category)
    ? currentProduct.category.map((cat: any) => cat.id)
    : [],  };

  const memoizedDefaults = useMemo(() => defaultValues, [currentProduct]);

  const methods = useForm<ProductFormValues>({
    resolver: yupResolver(ProductSchema),
    defaultValues: memoizedDefaults,
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const values  = watch()
  

  const onSubmit = async (data: ProductFormValues) => {
   if(!currentProduct){
    try {
      // console.log(data);
      let imageUrl = '';
      if (mainImage) {
        const formData = new FormData();
        formData.append('file', mainImage);
        const data = await axiosInstance.post('/v1/files/upload', formData);
        imageUrl = data.data.url;
      }
      console.log(imageUrl);
      const galleryUrls: string[] = [];
      if (galleryImages.length > 0) {
        console.log(galleryImages.length);
        
        for (let i = 0; i < galleryImages.length; i++) {
          const formData = new FormData();
          formData.append('file', galleryImages[i]);
          const data = await axiosInstance.post('/v1/files/upload', formData);
          galleryUrls.push(data.data.url);
        }
      }
      
      data.productGallery = galleryUrls
      console.log(galleryUrls);

      console.log({...data, productImage: imageUrl, productGallery: galleryUrls});
      
      const response = await axiosInstance.post('/v1/products', {...data, productImage: imageUrl, productGallery: galleryUrls, storeId: user?.seller?.store?.id});
      enqueueSnackbar('Product created successfully!', { variant: 'success' });
      router.push('/dashboard/products');
      router.push('/dashboard/products');      
      // const response = await axiosInstance.post('/v1/products', data);
      // enqueueSnackbar('Product created successfully!', { variant: 'success' });
      // router.push('/dashboard/products');
      // console.log(response);

    } catch (error) {
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }
   } else {
    try {
      // console.log(data);
      // --- IMAGE LOGIC PATCH START ---
    // Main image logic
    let imageUrl = '';
    if (mainImage) {
      const formData = new FormData();
      formData.append('file', mainImage);
      const data = await axiosInstance.post('/v1/files/upload', formData);
      imageUrl = data.data.url;
    } else {
      // If no new main image, keep the old one
      imageUrl = currentProduct?.productImage || '';
    }
    console.log('Final main image:', imageUrl);

    // Gallery logic
    // Get the current gallery from the form (after user removals)
    let currentGallery: string[] = Array.isArray(data.productGallery) ? data.productGallery.filter((v): v is string => typeof v === 'string') : [];
    // Upload new images and get their URLs
    let newGalleryUrls: string[] = [];
    if (galleryImages.length > 0) {
      for (let i = 0; i < galleryImages.length; i++) {
        // Only upload if the preview is in the currentGallery (not removed)
        if (currentGallery.includes(galleryImages[i].preview)) {
          const formData = new FormData();
          formData.append('file', galleryImages[i].file);
          const uploadRes = await axiosInstance.post('/v1/files/upload', formData);
          newGalleryUrls.push(uploadRes.data.url);
        }
      }
    }
// IMPORTANT: The gallery UI should render only from productGallery (the form value) for consistency and to avoid duplication.
    // Replace base64 previews in currentGallery with the uploaded URLs
    let updatedGallery = [...currentGallery];
    if (newGalleryUrls.length > 0 && galleryImages.length > 0) {
      // Map previews to URLs
      let urlIdx = 0;
      updatedGallery = currentGallery.map(entry => {
        // If entry is a base64 preview and we have a new URL for it, replace
        const isBase64 = typeof entry === 'string' && entry.startsWith('data:image');
        if (isBase64 && urlIdx < newGalleryUrls.length) {
          const url = newGalleryUrls[urlIdx];
          urlIdx++;
          return url;
        }
        return entry;
      });
    }
    data.productGallery = updatedGallery;
    console.log('Final gallery:', updatedGallery);
    // --- IMAGE LOGIC PATCH END ---

      // --- Handle deletion of removed images ---
      const getFileNameFromUrl = (url: string) => url.split('/').pop() || '';
      const originalMainImage = currentProduct?.productImage;
      const originalGallery = Array.isArray(currentProduct?.productGallery)
        ? currentProduct.productGallery
        : [];
      const newMainImage = imageUrl;
      const newGallery = updatedGallery;
      const removedImages: string[] = [];
      // Main image
      if (originalMainImage && originalMainImage !== newMainImage && originalMainImage.startsWith('http')) {
        removedImages.push(originalMainImage);
      }
      // Gallery images
      originalGallery.forEach((img: any) => {
        if (!newGallery.includes(img) && img.startsWith('http')) {
          removedImages.push(img);
        }
      });
      for (const url of removedImages) {
        const fileName = getFileNameFromUrl(url);
        if (fileName) {
          try {
            await axiosInstance.delete(`/v1/files/${fileName}`);
            console.log(`Deleted file: ${fileName}`);
          } catch (err) {
            console.error(`Failed to delete file ${fileName}:`, err);
          }
        }
      }
      // --- End deletion logic ---

      console.log({ ...data, productImage: imageUrl, productGallery: updatedGallery });
      
      const response = await axiosInstance.patch(`/v1/products/${currentProduct?.id}`, { ...data, productImage: imageUrl, productGallery: updatedGallery, storeId: user?.seller?.store?.id });
      enqueueSnackbar('Product created successfully!', { variant: 'success' });
      router.push('/dashboard/products');
      console.log(response);
      // router.push('/dashboard/products');      
      
      // const response = await axiosInstance.post('/v1/products', data);
      // enqueueSnackbar('Product created successfully!', { variant: 'success' });
      // router.push('/dashboard/products');
      // console.log(response);

    } catch (error: any) {
      console.error('Product update error:', error);
      enqueueSnackbar(`Something went wrong: ${error?.message || error}`, { variant: 'error' });
    } 
   }
  };

  const handleDropMainImage = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      setMainImage(file);
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setValue('productImage', base64Image);
      };
    }
  }, [setValue]);

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  // useEffect(() => {
  //   const handleUpload = async () => {
  //     if (!mainImage) return;
  //     const formData = new FormData();
  //     formData.append('file', mainImage);
  
  //     const data = await axiosInstance.post('/v1/files/upload', formData);
  //     console.log(data.data.url);
  //   };

  //   handleUpload()
  
  // }, [mainImage])

  

  const handleDropGalleryImages = useCallback((acceptedFiles: File[]) => {
  Promise.all(
    acceptedFiles.map(file => {
      return new Promise<{ file: File; preview: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => resolve({ file, preview: reader.result as string });
        reader.onerror = reject;
      });
    })
  ).then((galleryObjs) => {
    setGalleryImages((prev) => {
      // Prevent duplicates by preview string
      const previews = new Set(prev.map(img => img.preview));
      const newImgs = galleryObjs.filter(img => !previews.has(img.preview));
      return [...prev, ...newImgs];
    });
    // Only add unique previews to the form value
    const current = methods.getValues('productGallery') || [];
    const allPreviews = [...current];
    galleryObjs.forEach(img => {
      if (!allPreviews.includes(img.preview)) {
        allPreviews.push(img.preview);
      }
    });
    setValue('productGallery', allPreviews);

  });
}, [setValue]);

// NOTE: Ensure the gallery UI renders only from productGallery (the form value), not from galleryImages.

const onRemoveImage = useCallback((fileOrPreview: string | CustomFile) => {
  const currentGallery = methods.getValues('productGallery') || [];
  const updatedGallery = currentGallery.filter((image) => image !== fileOrPreview);
  setValue('productGallery', updatedGallery);

  // Remove from galleryImages by preview string
  setGalleryImages((prev) => prev.filter(img => img.preview !== fileOrPreview));
}, [setValue, methods]);


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {/* Left column: Section titles */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <ProductFormSectionTitle title="Product Details" />
          </Box>
        </Grid>
        {/* Right column: Form Fields */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Stack spacing={3}>
              {/* Details Section */}
              <RHFTextField name="productName" label="Name" />
              <RHFTextField name="productDescription" label="Description" multiline rows={4} />
              {/* Main Image Upload */}
              <RHFUpload onDrop={handleDropMainImage} name="productImage" helperText="Upload main image" />
              {/* Gallery Image Upload */}
              <RHFUpload onRemove={onRemoveImage} onDrop={handleDropGalleryImages} name="productGallery" multiple helperText="Upload gallery images" />
            </Stack>
          </Card>
          {/* Type Section */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="productStatus" label="Status" select>
                {PRODUCT_STATUS_OPTIONS.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </RHFTextField>
              {/* Add more type fields here if needed */}
            </Stack>
          </Card>
          {/* Availability Section */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Stack spacing={3}>
              <Controller
                name="productDate"
                control={methods.control}
                render={({ field }) => (
                  <RHFTextField
                    name="productDate"
                    label="Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={dayjs(field.value).format('YYYY-MM-DD')}
                    onChange={e => field.onChange(dayjs(e.target.value).toDate())}
                  />
                )}
              />
              <FormControl>
                <InputLabel>Categories</InputLabel>
                <Controller
                  name="category"
                  control={methods.control}
                  render={({ field }) => (
                    <Select
                      error={errors.category ? true : false}
                      helperText={errors.category?.message}
                      multiple
                      {...field}
                      input={<OutlinedInput label="Categories" />}
                      renderValue={(selected: string[]) =>
                        categories.filter((cat: any) => selected.includes(cat.id)).map((cat: any) => cat.categoryName).join(', ')
                      }
                      onChange={event => {
                        const value = event.target.value;
                        field.onChange(typeof value === 'string' ? value.split(',') : value);
                      }}
                      value={field.value ?? []}
                    >
                      {categories.map((cat: any) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          <Checkbox checked={field.value.indexOf(cat.id) > -1} />
                          <ListItemText primary={cat.categoryName} />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
              <Controller
                name="isFeatured"
                control={methods.control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!field.value}
                        onChange={e => field.onChange(e.target.checked)}
                      />
                    }
                    label="Featured"
                  />
                )}
              />
            </Stack>
          </Card>
          {/* Price Section */}
          <Card sx={{ p: 3 }}>
          
            <Stack spacing={3}>
              <RHFTextField error={!!errors.standardPrice} helperText={errors.standardPrice?.message} name="standardPrice" label="Standard Price" type="number" />
              <RHFTextField error={!!errors.offerPrice} helperText={errors.offerPrice?.message} name="offerPrice" label="Offer Price" type="number" />
              <RHFTextField error={!!errors.productQuantity} helperText={errors.productQuantity?.message} name="productQuantity" label="Quantity" type="number" />
            </Stack>
          </Card>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={methods.formState.isSubmitting}
            >
              {!currentProduct ? 'Create Product' : 'Save Changes'}
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
