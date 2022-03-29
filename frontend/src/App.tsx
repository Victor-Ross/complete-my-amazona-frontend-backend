import { Route, Routes } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import { Footer } from './components/footer';
import { Header } from './components/header';
import { Products } from './components/products';

import { CartPage } from './pages/Cart';
import { ProductPage } from './pages/Product';
import { Signin } from './pages/SigninPage';
import { Signup } from './pages/Signup';
import { ShippingAddressPage } from './pages/Shipping';
import { PaymentMethod } from './pages/PaymentMethod';
import PlaceOrder from './pages/PlaceOrder';
import OrderPage from './pages/Order';
import OrderHistoryPage from './pages/OrderHistory';
import ProfilePage from './pages/Profile';
import SearchPage from './pages/SearchPage';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <div className="d-flex flex-column site-container">
      <Header />
      <main style={{ flex: 1 }}>
        <Container className="mt-3">
          <Routes>
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/shipping" element={<ShippingAddressPage />} />
            <Route path="/payment" element={<PaymentMethod />} />
            <Route path="/placeorder" element={<PlaceOrder />} />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <OrderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orderhistory"
              element={
                <ProtectedRoute>
                  <OrderHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />
            <Route path="/" element={<Products />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default App;
