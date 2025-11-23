export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  basePrice: number;
  category: 'Business' | 'Marketing' | 'Large Format';
}

export interface PrintConfig {
  paperType: string;
  size: string;
  quantity: number;
  finish: string;
}

export interface CartItem {
  id: string;
  product: Product;
  config: PrintConfig;
  totalPrice: number;
  uploadedFile?: File | null;
}

export enum DeliveryMethod {
  PICKUP = 'PICKUP',
  DELIVERY = 'DELIVERY',
}

export interface OrderDetails {
  customerName: string;
  email: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  address?: string;
}
