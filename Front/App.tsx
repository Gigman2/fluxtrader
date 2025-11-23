import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Channels from "./pages/Channels";
import ChannelDetails from "./pages/ChannelDetails";
import TemplateBuilder from "./pages/TemplateBuilder";
import Analytics from "./pages/Analytics";
import Signals from "./pages/Signals";
import Settings from "./pages/Settings";
import ComponentLibrary from "./pages/ComponentLibrary";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";
// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Routes (No Sidebar/Layout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes (Wrapped in Layout) */}
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/signals" element={<Signals />} />
                    <Route path="/channels" element={<Channels />} />
                    <Route path="/channels/:id" element={<ChannelDetails />} />
                    <Route path="/templates" element={<TemplateBuilder />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/components" element={<ComponentLibrary />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
