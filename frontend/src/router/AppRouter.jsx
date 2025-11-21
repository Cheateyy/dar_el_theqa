import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/buyer/landingPage/page';
import SearchResults from '@/pages/buyer/searchResult/page';

{/*Put all your routers here */ }
function AppRouter() {

  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<LandingPage />}></Route> */}
        <Route path="/" element={< SearchResults />}></Route>

      </Routes>
    </Router>
  );
}

export default AppRouter;
