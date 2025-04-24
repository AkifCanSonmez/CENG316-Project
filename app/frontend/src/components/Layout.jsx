import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css'; // CSS dosyasını import et

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="layout-container">
      <header className="layout-header">
        Üniversite Bilgi Yönetim Sistemi (ÜBYS)
      </header>

      <div className="layout-body">
        <aside className="layout-sidebar">
          <nav>
            <ul>
              <li><Link to="/akif">📄 Not Bilgileri</Link></li>
              <li><Link to="/taslak1">🎓 Öğrenci Bilgileri</Link></li>
              <li><Link to="/taslak2">📊 Transkript</Link></li>
              <li><Link to="/taslak3">🗓️ Ders Programı</Link></li>
              <li><Link to="/taslak4">📑 Sınav Sonuçları</Link></li>
              <li><Link to="/taslak5">📬 Duyurular</Link></li>
              <li><Link to="/taslak6">📥 Belgeler</Link></li>
              <li><Link to="/taslak7">📌 Danışmanlık</Link></li>
              <li><Link to="/taslak8">🧾 Harç ve Ödemeler</Link></li>
              <li><Link to="/taslak9">🔐 Güvenlik Ayarları</Link></li>
            </ul>
          </nav>
        </aside>

        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
