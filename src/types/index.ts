export type ProductCategory =
  | 'Face cleansers and face washes'
  | 'Face serums'
  | 'Moisturizers'
  | 'Sunscreens'
  | 'Toners and face mists'
  | 'Face masks and exfoliators'
  | 'Lip care'
  | 'Eye care'
  | 'Body lotions and body care'
  | 'Hair care'
  | 'Makeup essentials'
  | 'Beauty tools and accessories';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size" or "Shade"
  value: string; // e.g. "50ml", "100ml", "Ivory Rose", "Warm Sand"
  priceDelta: number; // in PKR
  skuSuffix: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  price: number; // in PKR
  salePrice?: number; // in PKR
  netQuantity: string; // e.g. "50ml / 1.7 fl. oz."
  stock: number;
  rating: number;
  reviewCount: number;
  isDemoReviewCount: boolean;
  description: string;
  keyFeatures: string[];
  ingredients: string[];
  usageInstructions: string;
  precautions: string;
  variants: ProductVariant[];
  image: string;
  secondaryImage?: string;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  searchKeywords: string[];
  relatedProductIds: string[];
}

export type CurrencyCode = 'PKR' | 'USD' | 'AED' | 'GBP' | 'EUR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // 1 PKR = rate in target currency
  name: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export type UserRole =
  | 'super_admin'
  | 'product_manager'
  | 'order_manager'
  | 'delivery_staff'
  | 'marketing_manager'
  | 'customer_support'
  | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  password?: string;
  addresses?: Address[];
  createdAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'failed_delivery'
  | 'return_requested'
  | 'returned'
  | 'refunded';

export type PaymentMethod =
  | 'cod'
  | 'bank_transfer'
  | 'card'
  | 'jazzcash_easypaisa';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  selectedVariant?: ProductVariant;
  totalPrice: number;
}

export interface StatusTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note: string;
  actor?: string;
}

export interface Order {
  id: string; // e.g. "VB-10482"
  trackingNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  couponCode?: string;
  taxAmount: number;
  total: number;
  currency: CurrencyCode;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  codCollected?: boolean;
  statusTimeline: StatusTimelineEvent[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderValue: number;
  validUntil: string;
  isActive: boolean;
  usageCount: number;
  description: string;
}

export interface CustomerReview {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  isDemo: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  orderId?: string;
  subject: string;
  category: 'order' | 'delivery' | 'product' | 'return' | 'general';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  messages: {
    id: string;
    sender: string;
    role: string;
    message: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
}
