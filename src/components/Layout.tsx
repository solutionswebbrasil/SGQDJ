import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Database, Users, Box, Truck, Shield, FileText, FileSpreadsheet } from 'lucide-react';

const menuItems = [
  { path: '/cadastro-toners', label: 'Cadastro de Toners', icon: Database },
  { path: '/cadastro-unidades', label: 'Cadastro de Unidades', icon: Box },
  { path: '/registro-retornados', label: 'Registro de Retornados', icon: Box },
  { path: '/consulta-toners', label: 'Consulta de Toners', icon: Database },
  { path: '/consulta-unidades', label: 'Consulta de Unidades', icon: Box },
  { path: '/consulta-retornados', label: 'Consulta de Retornados', icon: Box },
  { path: '/registro-movimentacoes', label: 'Registro de Movimentações', icon: Truck },
  { path: '/registro-garantias', label: 'Registro de Garantias', icon: Shield },
  { path: '/registro-bpmns', label: 'Registro de BPMNs', icon: FileText },
  { path: '/arquivamento-its', label: 'Arquivamento de ITs', icon: FileText },
  { path: '/tco', label: 'TCO', icon: FileSpreadsheet },
];

function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#3f4c6b] text-white">
        <div className="p-4 text-xl font-bold border-b border-gray-700">SGQ</div>
        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm ${
                  location.pathname === item.path
                    ? 'bg-[#2c3e50] text-white'
                    : 'text-gray-300 hover:bg-[#2c3e50] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-4 py-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              {menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;