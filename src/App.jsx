// The list of pages (routes). Each URL shows a different page component.
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Setup from './pages/Setup.jsx';
import Play from './pages/Play.jsx';
// Results uses the big chart library, so it is only downloaded when someone opens that page.
const Results = lazy(() => import('./pages/Results.jsx'));
import Learn from './pages/Learn.jsx';
import Sdgs from './pages/Sdgs.jsx';
import Hall from './pages/Hall.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/play/setup" element={<Setup />} />
        <Route
          path="/play/results"
          element={
            <Suspense fallback={<div className="container page-header">Loading your report card…</div>}>
              <Results />
            </Suspense>
          }
        />
        <Route path="/learn" element={<Learn />} />
        <Route path="/sdgs" element={<Sdgs />} />
        <Route path="/hall" element={<Hall />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      {/* The game screen uses the whole window, without the normal footer. */}
      <Route element={<Layout bare />}>
        <Route path="/play" element={<Play />} />
      </Route>
    </Routes>
  );
}
