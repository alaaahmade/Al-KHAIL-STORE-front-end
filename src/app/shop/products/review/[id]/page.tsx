import ProductReviewView from '@/sections/shop/view/product-review-view';

export default function ProductReviewPage({ params }: { params: { id: string } }) {
  return <ProductReviewView productId={params.id} />;
}
