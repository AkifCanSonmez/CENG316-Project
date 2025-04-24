import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Sayfa bileşenleri
import AkifPage from "./pages/akif/AkifPage";
import BerkanPage from "./pages/berkan/BerkanPage";
import MesutPage from "./pages/masud/MasudPage";
import MuratPage from "./pages/murat/MuratPage";
import VagifPage from "./pages/vagif/VagifPage";
import EmirhanPage from "./pages/emirhan/EmirhanPage";
import EmrPage from "./pages/emr/EmrPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/akif" element={<AkifPage />} />
        <Route path="/berkan" element={<BerkanPage />} />
        <Route path="/masud" element={<MesutPage />} />
        <Route path="/murat" element={<MuratPage />} />
        <Route path="/vagif" element={<VagifPage />} />
        <Route path="/emirhan" element={<EmirhanPage />} />
        <Route path="/emr" element={<EmrPage />} />
      </Routes>
    </Router>
  );
}

export default App;

