import React, { lazy, Suspense } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { MainLayout } from '../layouts/MainLayout';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';
import { AdminRoute } from './AdminRoute';
import { AdminLayout } from '../layouts/AdminLayout';
import { PATHS } from './paths';

// Lazy loading page views for enhanced load performance
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const VendorRegister = lazy(() => import('../pages/auth/VendorRegister'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const Coupon = lazy(() => import('../pages/auth/Coupon'));
const Home = lazy(() => import('../pages/customer/Home'));


const Dashboard = lazy(() => import('../pages/Dashboard'));
const ProductCatalog = lazy(() => import('../pages/products/ProductCatalog'));
const ProductDetails = lazy(() => import('../pages/products/ProductDetails'));
const ProductPage = lazy(() => import('../pages/products/ProductPage'));
const CartPage = lazy(() => import('../pages/customer/CartPage'));
const CheckoutPage = lazy(() => import('../pages/customer/CheckoutPage'));
const PaymentPage = lazy(() => import('../pages/customer/PaymentPage'));
const OrderSuccessPage = lazy(() => import('../pages/customer/OrderSuccessPage'));
const MyOrdersPage = lazy(() => import('../pages/customer/MyOrdersPage'));
const TermsPage = lazy(() => import('../pages/customer/TermsPage'));
const AboutPage = lazy(() => import('../pages/customer/AboutPage'));
const ContactPage = lazy(() => import('../pages/customer/ContactPage'));
const OrdersDashboard = lazy(() => import('../pages/admin/OrdersDashboard'));
const OrderDetailPage = lazy(() => import('../pages/admin/OrderDetailPage'));
const SettingsPage = lazy(() => import('../pages/admin/SettingsPage'));
const UserSettingsPage = lazy(() => import('../pages/admin/UserSettingsPage'));
const AttributesPage = lazy(() => import('../pages/admin/AttributesPage'));
const PricelistsPage = lazy(() => import('../pages/admin/PricelistsPage'));
const AdminReports = lazy(() => import('../pages/admin/AdminReports'));
const QuotationTemplatePage = lazy(() => import('../pages/admin/QuotationTemplatePage'));
const AdminInvoicePage = lazy(() => import('../pages/admin/AdminInvoicePage'));
const AdminProductCreate = lazy(() => import('../pages/admin/AdminProductCreate'));
const AdminSchedule = lazy(() => import('../pages/admin/AdminSchedule'));
const AdminAttributeCreate = lazy(() => import('../pages/admin/AdminAttributeCreate'));
const AdminPricelistCreate = lazy(() => import('../pages/admin/AdminPricelistCreate'));

const OrderDetailsPage = lazy(() => import('../pages/customer/OrderDetailsPage'));
const TrackingPage = lazy(() => import('../pages/customer/TrackingPage'));
const ProfilePage = lazy(() => import('../pages/customer/ProfilePage'));
const InvoicePage = lazy(() => import('../pages/customer/InvoicePage'));
const AdminDashboard = lazy(() => import('../pages/customer/AdminDashboard'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div className="text-center font-semibold text-indigo-600 dark:text-indigo-400">
      Loading...
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Landing Route */}
        <Route path={PATHS.ROOT} element={<Home />} />
        <Route path={PATHS.PRODUCT_PAGE} element={<ProductPage />} />
        <Route path={PATHS.CART} element={<CartPage />} />
        <Route path={PATHS.CHECKOUT} element={<CheckoutPage />} />
        <Route path={PATHS.PAYMENT} element={<PaymentPage />} />
        <Route path={PATHS.ORDER_SUCCESS} element={<OrderSuccessPage />} />
        <Route path={PATHS.ORDERS} element={<MyOrdersPage />} />
        <Route path={PATHS.TERMS} element={<TermsPage />} />
        <Route path={PATHS.ABOUT} element={<AboutPage />} />
        <Route path={PATHS.CONTACT} element={<ContactPage />} />

        <Route path={PATHS.ORDER_DETAILS} element={<OrderDetailsPage />} />
        <Route path={PATHS.TRACK_RENTAL} element={<TrackingPage />} />
        <Route path={PATHS.PROFILE} element={<ProfilePage />} />
        <Route path={PATHS.INVOICE} element={<InvoicePage />} />


        {/* Public Authentication Routes */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={PATHS.LOGIN} element={<Login />} />
            <Route path={PATHS.REGISTER} element={<Register />} />
            <Route path={PATHS.REGISTER_VENDOR} element={<VendorRegister />} />
            <Route path={PATHS.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route path={PATHS.COUPON} element={<Coupon />} />

          </Route>
        </Route>

        {/* Protected Application Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path={PATHS.DASHBOARD} element={<Navigate to={PATHS.ADMIN_DASHBOARD} replace />} />
            <Route path={PATHS.PRODUCTS} element={<ProductCatalog />} />
            <Route path={PATHS.PRODUCT_DETAILS} element={<ProductDetails />} />
          </Route>
        </Route>

        {/* Protected Admin/Vendor Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path={PATHS.ADMIN_DASHBOARD} element={<AdminDashboard />} />
            <Route path={PATHS.ADMIN_ORDERS} element={<OrdersDashboard />} />
            <Route path={PATHS.ADMIN_ORDER_DETAILS} element={<OrderDetailPage />} />
            <Route path={PATHS.ADMIN_QUOTATIONS} element={<QuotationTemplatePage />} />
            <Route path={PATHS.ADMIN_INVOICE} element={<AdminInvoicePage />} />
            <Route path={PATHS.ADMIN_ATTRIBUTES} element={<AttributesPage />} />
            <Route path={PATHS.ADMIN_ATTRIBUTE_CREATE} element={<AdminAttributeCreate />} />
            <Route path={PATHS.ADMIN_PRICELISTS} element={<PricelistsPage />} />
            <Route path={PATHS.ADMIN_PRICELIST_CREATE} element={<AdminPricelistCreate />} />
            <Route path={PATHS.ADMIN_REPORTS} element={<AdminReports />} />
            <Route path={PATHS.ADMIN_PRODUCT_CREATE} element={<AdminProductCreate />} />
            <Route path={PATHS.ADMIN_SCHEDULE} element={<AdminSchedule />} />
            <Route path={PATHS.ADMIN_SETTINGS} element={<SettingsPage />} />
            <Route path={PATHS.ADMIN_USERS} element={<UserSettingsPage />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-center px-4">
              <h1 className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-400">404</h1>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-4">Page Not Found</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                The page you are looking for does not exist or has been moved.
              </p>
              <Link
                to={PATHS.DASHBOARD}
                className="mt-6 inline-flex items-center justify-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
