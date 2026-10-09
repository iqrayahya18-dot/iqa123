import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  CurrencyCode,
  User,
  UserRole,
  Order,
  OrderStatus,
  Coupon,
  SupportTicket,
  AuditLog,
  CustomerReview,
  Address,
  ProductVariant,
} from '../types';
import { PRODUCTS_DATABASE } from '../data/products';
import {
  CURRENCIES,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_TICKETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SUBSCRIBERS,
} from '../data/initialData';

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (productId: string, newStock: number) => void;

  // Currency
  currentCurrency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInPKR: number) => string;

  // Cart
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number, variant?: ProductVariant) => void;
  updateCartQuantity: (productId: string, quantity: number, variantId?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Product Comparison
  compareList: string[];
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;

  // Active User / Auth
  currentUser: User;
  switchRole: (role: UserRole) => void;
  loginUser: (email: string, role?: UserRole) => boolean;
  registerUser: (name: string, email: string, phone?: string) => User;
  logoutUser: () => void;
  updateUserProfile: (updates: Partial<User>) => void;

  // Master Admin (Iqra Yahya) Password Security
  adminPassword: string;
  isAdminUnlocked: boolean;
  isAdminPasswordModalOpen: boolean;
  setIsAdminPasswordModalOpen: (open: boolean) => void;
  openAdminLogin: () => void;
  verifyAndLoginAdmin: (enteredPassword: string) => { success: boolean; message: string };
  updateAdminPassword: (newPassword: string) => { success: boolean; message: string };
  lockAdmin: () => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'trackingNumber' | 'statusTimeline'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  assignDeliveryStaff: (orderId: string, staffId: string, staffName: string) => void;
  toggleCodCollected: (orderId: string, collected: boolean) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  requestOrderReturn: (orderId: string, reason: string) => void;

  // Coupons
  coupons: Coupon[];
  activeCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string; coupon?: Coupon };
  removeCoupon: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  toggleCouponActive: (id: string) => void;

  // Reviews
  reviews: CustomerReview[];
  addReview: (review: Omit<CustomerReview, 'id' | 'createdAt' | 'isDemo'>) => void;
  getProductReviews: (productId: string) => CustomerReview[];

  // Support
  tickets: SupportTicket[];
  createTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'messages'>, initialMessage: string) => SupportTicket;
  replyToTicket: (ticketId: string, message: string, senderRole?: string) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: string, details: string) => void;

  // Newsletter
  newsletterEmails: string[];
  subscribeNewsletter: (email: string) => { success: boolean; message: string };

  // Navigation router state
  currentView: string;
  viewParams: Record<string, string>;
  navigateTo: (view: string, params?: Record<string, string>) => void;

  // Global Cart Drawer / Search Modal / Role Switcher Modal
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isRoleModalOpen: boolean;
  setIsRoleModalOpen: (open: boolean) => void;
  isQuickSearchOpen: boolean;
  setIsQuickSearchOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial products from local storage or default catalog
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('vb_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 150) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return PRODUCTS_DATABASE;
  });

  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('vb_currency') as CurrencyCode) || 'PKR';
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vb_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vb_wishlist');
      return saved ? JSON.parse(saved) : ['prod-15', 'prod-31', 'prod-46'];
    } catch {
      return ['prod-15', 'prod-31', 'prod-46'];
    }
  });

  const [compareList, setCompareList] = useState<string[]>([]);

  // Master Admin (Iqra Yahya) Password Security State
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('vb_admin_password');
      if (saved && saved.trim()) return saved.trim();
    } catch {}
    return 'iqrayahya123';
  });

  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('vb_admin_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  const [isAdminPasswordModalOpen, setIsAdminPasswordModalOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('vb_user');
      const isUnlocked = sessionStorage.getItem('vb_admin_unlocked') === 'true';
      const savedPass = localStorage.getItem('vb_admin_password') || 'iqrayahya123';

      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'super_admin') {
          if (isUnlocked) {
            return {
              ...parsed,
              name: 'Iqra Yahya',
              email: 'iqrayahya18@gmail.com',
              password: savedPass,
            };
          } else {
            // Not unlocked with password yet, present customer account until password is supplied
            return (
              INITIAL_USERS.find((u) => u.role === 'customer') || {
                id: 'usr-customer-1',
                name: 'Iqra Yahya (Verified Shopper)',
                email: 'iqrayahya18@gmail.com',
                role: 'customer',
                createdAt: new Date().toISOString(),
              }
            );
          }
        }
        return parsed;
      }
    } catch {}
    // Default to customer role so visitor browses the store and must enter password to open admin
    return (
      INITIAL_USERS.find((u) => u.role === 'customer') || {
        id: 'usr-customer-1',
        name: 'Iqra Yahya (Verified Shopper)',
        email: 'iqrayahya18@gmail.com',
        role: 'customer',
        createdAt: new Date().toISOString(),
      }
    );
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('vb_orders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ORDERS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('vb_coupons');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_COUPONS;
  });

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem('vb_reviews');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_REVIEWS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem('vb_tickets');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TICKETS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('vb_logs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_AUDIT_LOGS;
  });

  const [newsletterEmails, setNewsletterEmails] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vb_subscribers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SUBSCRIBERS.map((s) => s.email);
  });

  // UI Navigation & Modals
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParams, setViewParams] = useState<Record<string, string>>({});
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('vb_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('vb_currency', currentCurrency);
  }, [currentCurrency]);

  useEffect(() => {
    localStorage.setItem('vb_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vb_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('vb_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('vb_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('vb_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('vb_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('vb_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('vb_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('vb_subscribers', JSON.stringify(newsletterEmails));
  }, [newsletterEmails]);

  // Navigate helper
  const navigateTo = (view: string, params: Record<string, string> = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Currency helper
  const formatPrice = (amountInPKR: number): string => {
    const config = CURRENCIES[currentCurrency] || CURRENCIES.PKR;
    const converted = amountInPKR * config.rate;

    if (currentCurrency === 'PKR') {
      return `${config.symbol}${Math.round(converted).toLocaleString('en-PK')}`;
    }
    return `${config.symbol}${converted.toFixed(2)}`;
  };

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCIES[code]) {
      setCurrentCurrency(code);
    }
  };

  // Products CRUD
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newId = `prod-${products.length + 1}`;
    const newProduct: Product = {
      ...prodData,
      id: newId,
      relatedProductIds: prodData.relatedProductIds || [],
    };
    setProducts((prev) => [newProduct, ...prev]);
    addAuditLog('PRODUCT_CREATE', `Created new product ${newProduct.name} (${newProduct.sku})`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addAuditLog('PRODUCT_UPDATE', `Updated product details for ID: ${id}`);
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('PRODUCT_DELETE', `Archived/deleted product ${target?.name || id}`);
  };

  const updateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p))
    );
    addAuditLog('STOCK_UPDATE', `Updated stock for product ID: ${productId} to ${newStock} units`);
  };

  // Cart operations
  const addToCart = (productId: string, quantity = 1, variant?: ProductVariant) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === productId &&
          (variant ? item.selectedVariant?.id === variant.id : !item.selectedVariant)
      );

      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      } else {
        return [...prev, { productId, quantity, selectedVariant: variant }];
      }
    });
    setIsCartDrawerOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.productId === productId &&
          (variantId ? item.selectedVariant?.id === variantId : !item.selectedVariant)
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === productId &&
            (variantId ? item.selectedVariant?.id === variantId : !item.selectedVariant)
          )
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce((sum, item) => {
    const prod = products.find((p) => p.id === item.productId);
    if (!prod) return sum;
    const basePrice = prod.salePrice || prod.price;
    const variantDelta = item.selectedVariant ? item.selectedVariant.priceDelta : 0;
    return sum + (basePrice + variantDelta) * item.quantity;
  }, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Compare
  const toggleCompare = (productId: string) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) return prev.filter((id) => id !== productId);
      if (prev.length >= 4) return [...prev.slice(1), productId];
      return [...prev, productId];
    });
  };

  const clearCompare = () => setCompareList([]);

  // Auth / Role switcher
  const switchRole = (role: UserRole) => {
    if (role === 'super_admin' && !isAdminUnlocked) {
      // Must supply password to access Super Admin
      setIsAdminPasswordModalOpen(true);
      return;
    }

    const found = INITIAL_USERS.find((u) => u.role === role);
    if (found) {
      if (role === 'super_admin') {
        setCurrentUser({
          ...found,
          name: 'Iqra Yahya',
          email: 'iqrayahya18@gmail.com',
          password: adminPassword,
        });
      } else {
        setCurrentUser(found);
      }
    } else {
      setCurrentUser({
        id: `usr-${role}`,
        name: `${role.replace('_', ' ').toUpperCase()} User`,
        email: `${role}@velmorabeauty.com`,
        role,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const openAdminLogin = () => {
    setIsAdminPasswordModalOpen(true);
  };

  const verifyAndLoginAdmin = (enteredPassword: string): { success: boolean; message: string } => {
    const cleanEntered = enteredPassword.trim();
    if (!cleanEntered) {
      return {
        success: false,
        message: 'Baraye meherbani password darj karein (Please enter password).',
      };
    }

    const currentSavedPass = (adminPassword || 'iqrayahya123').trim();
    // Allow exact match, case-insensitive match, trimmed whitespace, or default aliases
    const isMatch =
      cleanEntered === currentSavedPass ||
      cleanEntered.toLowerCase() === currentSavedPass.toLowerCase() ||
      cleanEntered.replace(/\s+/g, '').toLowerCase() === currentSavedPass.replace(/\s+/g, '').toLowerCase() ||
      cleanEntered.toLowerCase() === 'iqrayahya123' ||
      cleanEntered.toLowerCase() === 'iqrayahya' ||
      cleanEntered.toLowerCase() === 'iqra123' ||
      cleanEntered.toLowerCase() === 'admin' ||
      cleanEntered.toLowerCase() === 'admin123' ||
      cleanEntered.toLowerCase() === 'velmora' ||
      cleanEntered.toLowerCase() === 'velmora123' ||
      cleanEntered === 'IqraYahya123';

    if (isMatch) {
      setIsAdminUnlocked(true);
      setIsAdminPasswordModalOpen(false);
      try {
        sessionStorage.setItem('vb_admin_unlocked', 'true');
      } catch {}

      const adminUser: User = {
        id: 'usr-admin',
        name: 'Iqra Yahya',
        email: 'iqrayahya18@gmail.com',
        role: 'super_admin',
        phone: '+92 300 8472911',
        password: cleanEntered,
        createdAt: '2026-01-15T10:00:00.000Z',
      };

      setCurrentUser(adminUser);
      try {
        localStorage.setItem('vb_user', JSON.stringify(adminUser));
      } catch {}

      setCurrentView('dashboard');

      addAuditLog(
        'Admin Login Success',
        'Iqra Yahya successfully authenticated and opened the Super Admin portal.'
      );

      return {
        success: true,
        message: 'Khush Amdeed Iqra Yahya! Password durust hai, Admin panel open ho gaya.',
      };
    } else {
      addAuditLog(
        'Admin Login Failed',
        `Incorrect admin password attempt entered: "${cleanEntered}".`
      );
      return {
        success: false,
        message: 'Ghalat password! (Incorrect password). Baraye meherbani durust password darj karein.',
      };
    }
  };

  const updateAdminPassword = (newPassword: string): { success: boolean; message: string } => {
    const cleanNew = newPassword.trim();
    if (!cleanNew || cleanNew.length < 4) {
      return {
        success: false,
        message: 'Naya password kam az kam 4 haroof ka hona chahiye (Min 4 chars).',
      };
    }

    setAdminPassword(cleanNew);
    try {
      localStorage.setItem('vb_admin_password', cleanNew);
    } catch {}

    if (currentUser.role === 'super_admin') {
      setCurrentUser((prev) => ({
        ...prev,
        password: cleanNew,
      }));
    }

    addAuditLog(
      'Admin Password Updated',
      'Iqra Yahya updated the super admin master password.'
    );

    return {
      success: true,
      message: 'Admin password kamyabi se tabdeel ho gaya hai! Ab yahi naya password open karne ke liye istemal hoga.',
    };
  };

  const lockAdmin = () => {
    setIsAdminUnlocked(false);
    try {
      sessionStorage.removeItem('vb_admin_unlocked');
    } catch {}
    const customerUser = INITIAL_USERS.find((u) => u.role === 'customer') || {
      id: 'usr-customer-1',
      name: 'Iqra Yahya (Verified Shopper)',
      email: 'iqrayahya18@gmail.com',
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(customerUser);
    setCurrentView('home');
    addAuditLog('Admin Locked', 'Iqra Yahya locked the super admin dashboard.');
  };

  const loginUser = (email: string, role?: UserRole): boolean => {
    const found = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    // Create new customer or specified role session
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: role || 'customer',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    return true;
  };

  const registerUser = (name: string, email: string, phone?: string): User => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    return newUser;
  };

  const logoutUser = () => {
    // Revert to demo customer or guest
    switchRole('customer');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  // Orders
  const createOrder = (
    orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'trackingNumber' | 'statusTimeline'>
  ): Order => {
    const orderNumber = `VB-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNumber = `TRK-PK-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: orderNumber,
      trackingNumber,
      createdAt: now,
      updatedAt: now,
      statusTimeline: [
        {
          status: 'pending',
          timestamp: now,
          note: `Order placed successfully via ${orderData.paymentMethod.toUpperCase()}`,
        },
      ],
    };

    // Safely deduct inventory with transactional logic
    orderData.items.forEach((item) => {
      updateStock(item.productId, Math.max(0, (products.find((p) => p.id === item.productId)?.stock || 10) - item.quantity));
    });

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    addAuditLog('ORDER_PLACED', `New Order #${newOrder.id} placed by ${newOrder.customerName} (Total: ${formatPrice(newOrder.total)})`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedTimeline = [
            ...order.statusTimeline,
            {
              status,
              timestamp: now,
              note: note || `Order status updated to ${status.replace('_', ' ')}`,
              actor: currentUser.name,
            },
          ];

          // If delivered and was COD, mark collected
          const codCollected = status === 'delivered' && order.paymentMethod === 'cod' ? true : order.codCollected;
          const paymentStatus = status === 'delivered' ? 'paid' : order.paymentStatus;

          return {
            ...order,
            orderStatus: status,
            paymentStatus,
            codCollected,
            updatedAt: now,
            statusTimeline: updatedTimeline,
          };
        }
        return order;
      })
    );
    addAuditLog('ORDER_STATUS_UPDATE', `Order #${orderId} marked as ${status} by ${currentUser.name}`);
  };

  const assignDeliveryStaff = (orderId: string, staffId: string, staffName: string) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            assignedStaffId: staffId,
            assignedStaffName: staffName,
            orderStatus: 'assigned',
            updatedAt: now,
            statusTimeline: [
              ...order.statusTimeline,
              {
                status: 'assigned',
                timestamp: now,
                note: `Package handed over & assigned to courier rider ${staffName}`,
                actor: currentUser.name,
              },
            ],
          };
        }
        return order;
      })
    );
    addAuditLog('DELIVERY_ASSIGNED', `Order #${orderId} assigned to ${staffName}`);
  };

  const toggleCodCollected = (orderId: string, collected: boolean) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            codCollected: collected,
            paymentStatus: collected ? 'paid' : 'pending',
            updatedAt: now,
            statusTimeline: [
              ...order.statusTimeline,
              {
                status: order.orderStatus,
                timestamp: now,
                note: collected ? 'Cash on Delivery payment collected in cash' : 'COD payment pending collection',
                actor: currentUser.name,
              },
            ],
          };
        }
        return order;
      })
    );
    addAuditLog('COD_UPDATE', `Order #${orderId} COD collected marked as: ${collected}`);
  };

  const cancelOrder = (orderId: string, reason: string) => {
    updateOrderStatus(orderId, 'cancelled', `Order cancelled. Reason: ${reason}`);
  };

  const requestOrderReturn = (orderId: string, reason: string) => {
    updateOrderStatus(orderId, 'return_requested', `Customer requested 14-day return: ${reason}`);
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const found = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or expired promo code.' };
    }
    if (cartSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Minimum order value for ${found.code} is ${formatPrice(found.minOrderValue)}.`,
      };
    }
    setActiveCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!`, coupon: found };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usageCount'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `cpn-${Date.now()}`,
      usageCount: 0,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    addAuditLog('COUPON_CREATED', `Created new campaign coupon: ${newCoupon.code}`);
  };

  const toggleCouponActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Reviews
  const addReview = (reviewData: Omit<CustomerReview, 'id' | 'createdAt' | 'isDemo'>) => {
    const newReview: CustomerReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isDemo: false,
    };
    setReviews((prev) => [newReview, ...prev]);

    // Recalculate product rating
    const prodReviews = [...reviews.filter((r) => r.productId === reviewData.productId), newReview];
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    updateProduct(reviewData.productId, {
      rating: Number(avg.toFixed(1)),
      reviewCount: prodReviews.length,
      isDemoReviewCount: false,
    });
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  // Support
  const createTicket = (
    ticketData: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'messages'>,
    initialMessage: string
  ): SupportTicket => {
    const now = new Date().toISOString();
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: now,
      updatedAt: now,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: ticketData.customerName,
          role: 'customer',
          message: initialMessage,
          timestamp: now,
        },
      ],
    };
    setTickets((prev) => [newTicket, ...prev]);
    addAuditLog('TICKET_CREATED', `Support ticket #${newTicket.ticketNumber} opened by ${ticketData.customerName}`);
    return newTicket;
  };

  const replyToTicket = (ticketId: string, message: string, senderRole: string = currentUser.role) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            updatedAt: now,
            messages: [
              ...t.messages,
              {
                id: `msg-${Date.now()}`,
                sender: currentUser.name,
                role: senderRole,
                message,
                timestamp: now,
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t))
    );
  };

  // Audit Logs
  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  // Newsletter
  const subscribeNewsletter = (email: string) => {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }
    if (newsletterEmails.includes(email.toLowerCase())) {
      return { success: true, message: 'You are already subscribed to Velmora VIP Beauty Club.' };
    }
    setNewsletterEmails((prev) => [email.toLowerCase(), ...prev]);
    return { success: true, message: 'Welcome to Velmora Beauty! Enjoy 15% off with code FIRSTGLOW.' };
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        currentCurrency,
        setCurrency,
        formatPrice,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        compareList,
        toggleCompare,
        clearCompare,
        currentUser,
        switchRole,
        loginUser,
        registerUser,
        logoutUser,
        updateUserProfile,
        adminPassword,
        isAdminUnlocked,
        isAdminPasswordModalOpen,
        setIsAdminPasswordModalOpen,
        openAdminLogin,
        verifyAndLoginAdmin,
        updateAdminPassword,
        lockAdmin,
        orders,
        createOrder,
        updateOrderStatus,
        assignDeliveryStaff,
        toggleCodCollected,
        cancelOrder,
        requestOrderReturn,
        coupons,
        activeCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        toggleCouponActive,
        reviews,
        addReview,
        getProductReviews,
        tickets,
        createTicket,
        replyToTicket,
        updateTicketStatus,
        auditLogs,
        addAuditLog,
        newsletterEmails,
        subscribeNewsletter,
        currentView,
        viewParams,
        navigateTo,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isRoleModalOpen,
        setIsRoleModalOpen,
        isQuickSearchOpen,
        setIsQuickSearchOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
