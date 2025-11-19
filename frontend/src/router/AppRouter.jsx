import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BuyerHome from '../pages/buyer/components/BuyerHome';

{/*Put all your routers here */ }
function AppRouter() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<BuyerHome />}></Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
