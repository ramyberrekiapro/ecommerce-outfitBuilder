export type ProductCategory = "top" | "bottom" | "dress" | "outerwear";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  colors: string[];
  sizes: string[];
  images: string[];
  description: string;
  material: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  qty: number;
}
