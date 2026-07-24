import './admin.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminLeaders from './pages/AdminLeaders';
import AdminCareers from './pages/AdminCareers';
import AdminProducts from './pages/AdminProducts';
import AdminEduSkills from './pages/AdminEduSkills';
import AdminApex from './pages/AdminApex';
import ResourceListView from './pages/ResourceListView';
import AdminBlog from './pages/AdminBlog';
import AdminUsers from './pages/AdminUsers';
import AdminServices from './pages/AdminServices';
import AdminSolutions from './pages/AdminSolutions';
import AdminInbox from './pages/AdminInbox';
import AdminCertificates from './pages/AdminCertificates';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
};

const AdminApp = () => (
  <Routes>
    <Route path="/login" element={<AdminLogin />} />
    <Route path="/" element={<Navigate to="/admin/login" replace />} />
    <Route
      path="/*"
      element={
        <PrivateRoute>
          <AdminLayout>
            <Routes>
              <Route path="/dashboard"         element={<AdminDashboard />} />
              <Route path="/leaders"           element={<AdminLeaders />} />
              <Route path="/careers"           element={<AdminCareers />} />
              <Route path="/products"          element={<AdminProducts />} />
              <Route path="/eduskills"         element={<AdminEduSkills />} />
              <Route path="/apex-items"        element={<AdminApex />} />
              <Route path="/blogs"             element={<AdminBlog />} />
              <Route path="/services"           element={<AdminServices />} />
              <Route path="/solutions"          element={<AdminSolutions />} />
              <Route path="/inbox"             element={<AdminInbox />} />
              <Route path="/users"             element={<AdminUsers />} />
              <Route path="/certificates"      element={<AdminCertificates />} />
              <Route path="/"                  element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="*"                  element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </AdminLayout>
        </PrivateRoute>
      }
    />
  </Routes>
);

export default AdminApp;
