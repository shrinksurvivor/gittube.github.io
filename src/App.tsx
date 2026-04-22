/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { RepositoryDetails } from './pages/RepositoryDetails';
import { Upload } from './pages/Upload';
import { StandAloneAuditor as StandardAuditor } from './pages/StandardAuditor';
import { Community } from './pages/Community';
import { Profile } from './pages/Profile';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          {/* We wrap routes in a div for potential styling or debugging */}
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/repo/:id" element={<RepositoryDetails />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/auditor" element={<StandardAuditor />} />
              <Route path="/community" element={<Community />} />
              <Route path="/profile/:uid" element={<Profile />} />
              {/* Catch-all to redirect to home if route is wrong */}
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
        </Layout>
      </AuthProvider>
    </Router>
  );
}






