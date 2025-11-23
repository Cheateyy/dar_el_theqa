import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/landingPage/components/page';

{/*Put all your routers here */ }
function AppRouter() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
