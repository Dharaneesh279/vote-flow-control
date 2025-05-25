
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import VotePage from "./pages/VotePage";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const authData = localStorage.getItem('authData');
    if (authData) {
      const { role } = JSON.parse(authData);
      setIsAuthenticated(true);
      setUserRole(role);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                !isAuthenticated ? (
                  <LoginPage onLogin={(role) => {
                    setIsAuthenticated(true);
                    setUserRole(role);
                  }} />
                ) : (
                  <Navigate to={userRole === 'admin' ? '/admin' : '/vote'} replace />
                )
              } 
            />
            <Route 
              path="/admin" 
              element={
                isAuthenticated && userRole === 'admin' ? (
                  <AdminPage onLogout={() => {
                    setIsAuthenticated(false);
                    setUserRole(null);
                    localStorage.removeItem('authData');
                  }} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/vote" 
              element={
                isAuthenticated && userRole === 'user' ? (
                  <VotePage onLogout={() => {
                    setIsAuthenticated(false);
                    setUserRole(null);
                    localStorage.removeItem('authData');
                  }} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
