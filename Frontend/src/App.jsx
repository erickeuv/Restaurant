import { Routes, Route } from 'react-router-dom';
import React from 'react';  
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../src/css/tailwind.css'; 
import '../src/css/styles.css'; 
import Home from './views/Home';
import Menu from './views/Menu';
import Login from './views/Login';
import Signup from './views/Signup';
import Profile from './views/Profile';
import AdminProducts from './views/Admin/AdminProducts'; 
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute'; 
import { AuthProvider } from './context/AuthContext'; 

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen"> 
        <Header /> 
        <div className="flex-grow"> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Ruta para el perfil, protegida con PrivateRoute */}
            <Route 
              path="/profile"  
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />

            {/* Ruta para administrar productos, protegida con PrivateRoute y solo accesible a administradores */}
            <Route 
              path="/admin/products"  
              element={
                <PrivateRoute requiredRole="admin"> {/* Agrega el rol requerido */}
                  <AdminProducts />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
