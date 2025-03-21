import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard.tsx';
import CadastroToners from './pages/CadastroToners.tsx';
import CadastroUnidades from './pages/CadastroUnidades.tsx';
import RegistroRetornados from './pages/RegistroRetornados.tsx';
import ConsultaToners from './pages/ConsultaToners.tsx';
import ConsultaUnidades from './pages/ConsultaUnidades.tsx';
import ConsultaRetornados from './pages/ConsultaRetornados.tsx';
import RegistroMovimentacoes from './pages/RegistroMovimentacoes.tsx';
import RegistroGarantias from './pages/RegistroGarantias.tsx';
import RegistroBPMNs from './pages/RegistroBPMNs.tsx';
import ArquivamentoITs from './pages/ArquivamentoITs.tsx';
import TCO from './pages/TCO.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="cadastro-toners" element={<CadastroToners />} />
          <Route path="cadastro-unidades" element={<CadastroUnidades />} />
          <Route path="registro-retornados" element={<RegistroRetornados />} />
          <Route path="consulta-toners" element={<ConsultaToners />} />
          <Route path="consulta-unidades" element={<ConsultaUnidades />} />
          <Route path="consulta-retornados" element={<ConsultaRetornados />} />
          <Route path="registro-movimentacoes" element={<RegistroMovimentacoes />} />
          <Route path="registro-garantias" element={<RegistroGarantias />} />
          <Route path="registro-bpmns" element={<RegistroBPMNs />} />
          <Route path="arquivamento-its" element={<ArquivamentoITs />} />
          <Route path="tco" element={<TCO />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App