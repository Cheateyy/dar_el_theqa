import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import ListingDetails_sell from '../pages/PropertyDetails_sell/ListingDetails_sell.jsx';
import ListingDetails_rent from '../pages/PropertyDetails_rent/ListingDetails_rent.jsx';
import SellerListingSell from '../pages/seller_ListingView_sell/seller_ListingView_sell.jsx';
import SellerListingRent from '../pages/seller_ListingView_rent/seller_ListingView_rent.jsx';
import AdmingListing from '../pages/admin_ListingView/admin_ListingView.jsx';
import UpdateListing from '../pages/seller_Update_listing/Listing.jsx';
import AdminReviewSell from '../pages/admin_ListingReview_sell/adminReviewSell.jsx';
import AdminReviewRent from '../pages/admin_ListingReview_rent/adminReviewRent.jsx';
import LandingPage from '../pages/buyer/landingPage/page';
import SearchResults from '@/pages/buyer/searchResult/page';
import { Favorites } from '@/pages/buyer/favorites/page';
import { BuyerLayout } from '@/pages/buyer/layout';
import { Interests } from '@/pages/buyer/Interests/page';

// forms-tables imports
import AddListingPage from "../pages/AddListingPage.jsx";
import AddListingPage2 from "../pages/AddListingPage2.jsx";
import AddListingPage3 from "../pages/AddListingPage3.jsx";
import Addpartner from "../pages/Addpartner.jsx";
import PartnerAccounts from "../pages/PartnerAccounts.jsx";
import UserAccounts from "../pages/UserAccounts.jsx";
import AuditLog from "../pages/AuditLog.jsx";
import LeadMessages from "../pages/LeadMessages.jsx";
import Navbar from "../components/Navbar.jsx";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/details" element={<Outlet />}>
          <Route path="property-details-sell" element={<ListingDetails_sell />} />
          <Route path="property-details-rent" element={<ListingDetails_rent />} />
          <Route path="sellerListing-sell" element={<SellerListingSell />} />
          <Route path="sellerListing-rent" element={<SellerListingRent />} />
          <Route path="admingListing" element={<AdmingListing />} />
          <Route path="sellerUpdateListing" element={<UpdateListing />} />
          <Route path="adminReviewSell" element={<AdminReviewSell />} />
          <Route path="adminReviewRent" element={<AdminReviewRent />} />
        </Route>

        <Route path="/" element={<BuyerLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="search-results" element={<SearchResults />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="interests" element={<Interests />} />
        </Route>

        <Route path="/forms-tables">
          <Route index={true} element={<><Navbar /><AddListingPage /></>} />
          <Route path="add-listing" element={<><Navbar /><AddListingPage /></>} />
          <Route path="add-listing/step-2" element={<><Navbar /><AddListingPage2 /></>} />
          <Route path="add-listing/step-2/step-3" element={<><Navbar /><AddListingPage3 /></>} />
          <Route path="add-partner" element={<><Navbar /><Addpartner /></>} />
          <Route path="partner-accounts" element={<><Navbar /><PartnerAccounts /></>} />
          <Route path="user-accounts" element={<><Navbar /><UserAccounts /></>} />
          <Route path="audit-log" element={<><Navbar /><AuditLog /></>} />
          <Route path="lead-messages" element={<><Navbar /><LeadMessages /></>} />
        </Route>

      </Routes>
    </Router>
  );
}

export default AppRouter;
