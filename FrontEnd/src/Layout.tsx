// src/components/layout/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div>
      <h1>Header</h1>
      <main>
        {/* O Outlet renderiza os componentes filhos da rota */}
        <Outlet />
      </main>
      <footer>
        <p>© 2025 Meu App Incrível</p>
      </footer>
    </div>
  );
};

export default Layout;