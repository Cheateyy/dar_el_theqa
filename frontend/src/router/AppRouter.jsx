import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Auth pages imports
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import ConfirmEmailPage from '../pages/ConfirmEmailPage';

// Property details imports
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

// Forms-tables imports
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
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/confirm-email" element={<ConfirmEmailPage />} />

      {/* Property Details Routes */}
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

      {/* Buyer Routes */}
      <Route path="/" element={<BuyerLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="search-results" element={<SearchResults />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="interests" element={<Interests />} />
      </Route>

      {/* Forms and Tables Routes */}
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

      {/* 404 - Catch all unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;