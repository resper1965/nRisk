import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import NriskOverview from "./pages/NriskOverview";
import SupplyChain from "./pages/SupplyChain";
import Insurance from "./pages/Insurance";
import InternalCompliance from "./pages/InternalCompliance";
import Assessments from "./pages/Assessments";
import Methodology from "./pages/Methodology";
import Contact from "./pages/Contact";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/nrisk" replace />} />
        <Route path="nrisk" element={<NriskOverview />} />
        <Route path="nrisk/supply-chain" element={<SupplyChain />} />
        <Route path="nrisk/compliance" element={<InternalCompliance />} />
        <Route path="nrisk/insurance" element={<Insurance />} />
        <Route path="nrisk/assessments" element={<Assessments />} />
        <Route path="nrisk/methodology" element={<Methodology />} />
        <Route path="nrisk/contact" element={<Contact />} />
      </Route>
      <Route path="*" element={<Navigate to="/nrisk" replace />} />
    </Routes>
    </>
  );
}

export default App;
