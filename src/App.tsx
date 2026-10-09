import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { QuickSearchModal } from './components/common/QuickSearchModal';
import { AdminPasswordModal } from './components/common/AdminPasswordModal';

// Storefront Pages
import { HomePage } from './components/storefront/HomePage';
import { ShopPage } from './components/storefront/ShopPage';
import { ProductDetailPage } from './components/storefront/ProductDetailPage';
import { CheckoutPage } from './components/storefront/CheckoutPage';
import { OrderConfirmationPage } from './components/storefront/OrderConfirmationPage';
import { AboutPage } from './components/storefront/AboutPage';
import { ContactPage } from './components/storefront/ContactPage';
import { PolicyPage } from './components/storefront/PolicyPages';

// Dashboards (RBAC)
import { DashboardLayout } from './components/dashboards/DashboardLayout';
import { SuperAdminDashboard } from './components/dashboards/SuperAdminDashboard';
import { ProductManagerDashboard } from './components/dashboards/ProductManagerDashboard';
import { OrderManagerDashboard } from './components/dashboards/OrderManagerDashboard';
import { DeliveryStaffDashboard } from './components/dashboards/DeliveryStaffDashboard';
import { CustomerDashboard } from './components/dashboards/CustomerDashboard';
import { MarketingManagerDashboard } from './components/dashboards/MarketingManagerDashboard';
import { CustomerSupportDashboard } from './components/dashboards/CustomerSupportDashboard';

const MainRouter: React.FC = () => {
  const { currentView, currentUser } = useStore();

  const renderDashboardByRole = () => {
    switch (currentUser.role) {
      case 'super_admin':
        return <SuperAdminDashboard />;
      case 'product_manager':
        return <ProductManagerDashboard />;
      case 'order_manager':
        return <OrderManagerDashboard />;
      case 'delivery_staff':
        return <DeliveryStaffDashboard />;
      case 'customer':
        return <CustomerDashboard />;
      case 'marketing_manager':
        return <MarketingManagerDashboard />;
      case 'customer_support':
        return <CustomerSupportDashboard />;
      default:
        return <CustomerDashboard />;
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-confirmation':
        return <OrderConfirmationPage />;
      case 'dashboard':
        return <DashboardLayout>{renderDashboardByRole()}</DashboardLayout>;
      case 'account':
        return <DashboardLayout><CustomerDashboard /></DashboardLayout>;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'policy-shipping':
        return <PolicyPage type="shipping" />;
      case 'policy-returns':
        return <PolicyPage type="returns" />;
      case 'policy-privacy':
        return <PolicyPage type="privacy" />;
      case 'policy-terms':
        return <PolicyPage type="terms" />;
      case 'faq':
        return <PolicyPage type="faq" />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#1E2929]">
      <Header />
      <main className="flex-1">{renderView()}</main>
      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <QuickSearchModal />
      <AdminPasswordModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainRouter />
    </StoreProvider>
  );
}
