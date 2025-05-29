import { Box, Divider, Tab, Tabs, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CustomerReviews } from './product-customer-review';

export function ProductTabs({ product }: { product: any }) {
  const tabLabels = Object.keys(
    product?.tabs || {
      Description:
        'Experience the ultimate in luxury skincare with our advanced anti-aging face cream. This premium formula combines powerful active ingredients with cutting-edge technology to deliver visible results.',
      Ingredients:
        'Water, Glycerin, Cetearyl Alcohol, Shea Butter, Niacinamide, Hyaluronic Acid, Vitamin E, Peptides, Fragrance.',
      'How to Use':
        'Apply a small amount to cleansed face and neck morning and night. Massage gently until fully absorbed.',
      Reviews: [],
    }
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab');
  const initialTab =
    tabParam && !isNaN(Number(tabParam)) && Number(tabParam) < tabLabels.length
      ? Number(tabParam)
      : 0;
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    // If the tab param changes externally, update the state
    if (tab !== initialTab) {
      setTab(initialTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam]);

  const handleTabChange = (_: any, value: number) => {
    setTab(value);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('tab', value.toString());
    router.replace(`?${params.toString()}`);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Tabs value={tab} onChange={handleTabChange}>
        {tabLabels.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ minHeight: 80 }}>
        {tab === 0 && (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {product?.tabs?.Description}
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {(product?.highlights || []).map((h: any, i: number) => (
                <li key={i} style={{ color: i === 0 ? '#E91E63' : '#333' }}>
                  {h}
                </li>
              ))}
            </ul>
          </Box>
        )}
        {tab === 1 && <Typography variant="body1">{product?.tabs?.Ingredients}</Typography>}
        {tab === 2 && <Typography variant="body1">{product?.tabs?.['How to Use']}</Typography>}
        {tab === 3 && (
          <CustomerReviews
            Reviews={product?.comments || []}
            reviewSummary={{
              average:
                product?.comments?.length > 0
                  ? (
                      product.comments.reduce((sum: number, r: any) => sum + r.rating, 0) /
                      product.comments.length
                    ).toFixed(1)
                  : 0,
              total: product?.comments?.length || 0,
              breakdown: [
                {
                  stars: 5,
                  percent: Math.round(
                    ((product?.comments?.filter((r: any) => r.rating === 5).length || 0) /
                      (product?.comments?.length || 1)) *
                      100
                  ),
                },
                {
                  stars: 4,
                  percent: Math.round(
                    ((product?.comments?.filter((r: any) => r.rating === 4).length || 0) /
                      (product?.comments?.length || 1)) *
                      100
                  ),
                },
                {
                  stars: 3,
                  percent: Math.round(
                    ((product?.comments?.filter((r: any) => r.rating === 3).length || 0) /
                      (product?.comments?.length || 1)) *
                      100
                  ),
                },
                {
                  stars: 2,
                  percent: Math.round(
                    ((product?.comments?.filter((r: any) => r.rating === 2).length || 0) /
                      (product?.comments?.length || 1)) *
                      100
                  ),
                },
                {
                  stars: 1,
                  percent: Math.round(
                    ((product?.comments?.filter((r: any) => r.rating === 1).length || 0) /
                      (product?.comments?.length || 1)) *
                      100
                  ),
                },
              ],
              highlights: [], // You can add highlight logic if needed
            }}
          />
        )}
      </Box>
    </Box>
  );
}
