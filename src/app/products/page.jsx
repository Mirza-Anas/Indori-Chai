import React from 'react'
import ProductHome from '@/components/ProductHome';
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Shop Premium Indian Tea",
  description:
    "Browse Indori Chai's range of authentic Indian tea blends. Choose your favorite tea and order online for delivery across India.",
  path: "/products",
});

const Products = () => {
  return (
    <div className='pt-24 pb-10 bg-white'>
      <ProductHome />
    </div>
  )
}

export default Products;
