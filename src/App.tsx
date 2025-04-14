import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CryptoTable from "./pages/CryptoTable";
import CryptoPage from "./pages/CoinDetails"; // <-- Make sure this exists
import CryptoDashboard from "./pages/CryptoDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-white p-4">
          <Routes>
            <Route path="/" element={<CryptoTable />} />
            <Route path="/dashboard" element={<CryptoDashboard />} />
            <Route path="/coin/:id" element={<CryptoPage />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
