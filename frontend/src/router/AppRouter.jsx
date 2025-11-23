import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/buyer/landingPage/page';
import SearchResults from '@/pages/buyer/searchResults/page';
import { Favorites } from '@/pages/buyer/favorites/page';
import { BuyerLayout } from '@/pages/buyer/layout';
import { Interests } from '@/pages/buyer/Interests/page';

{/*Put all your routers here */ }
function AppRouter() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<BuyerLayout />}>
          <Route index={true} element={<LandingPage />} />
          <Route path="/search-results" element={< SearchResults />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/interests" element={<Interests />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default AppRouter;
