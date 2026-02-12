export type ProductCategory = "wallpaper" | "photo" | "icon";

export type Product = {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  price: number;
  image: string;
  downloadFile: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
};

export type OrderItem = {
  title: string;
  downloadFile: string;
};

export type Order = {
  id: string;
  items: OrderItem[];
};
