import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceDetail from "./pages/InvoiceDetail";
import Feedback from "./pages/Feedback";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/invoice/:id" element={<InvoiceDetail />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route
            path="/create-invoice"
            element={
              <ProtectedRoute roles={["freelancer", "admin"]}>
                <CreateInvoice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
