import { Box, Divider, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { CustomerReviews } from './product-customer-review';

export function ProductTabs({ product }: { product: any }) {
  const [tab, setTab] = useState(0);
  const tabLabels = Object.keys(product.tabs);
  return (
    <Box sx={{ mt: 4 }}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        {tabLabels.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ minHeight: 80 }}>
        {tab === 0 && (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {product.tabs.Description}
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {product.highlights.map((h: any, i: number) => (
                <li key={i} style={{ color: i === 0 ? '#E91E63' : '#333' }}>{h}</li>
              ))}
            </ul>
          </Box>
        )}
        {tab === 1 && (
          <Typography variant="body1">{product.tabs.Ingredients}</Typography>
        )}
        {tab === 2 && (
          <Typography variant="body1">{product.tabs['How to Use']}</Typography>
        )}
        {tab === 3 && <CustomerReviews Reviews={product.Reviews} reviewSummary={product.reviewSummary} />}
      </Box>
    </Box>
  );
}