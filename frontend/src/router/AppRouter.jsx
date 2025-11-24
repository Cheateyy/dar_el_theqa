import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/property-details-sell" element={<ListingDetails_sell />} />
        <Route path="/property-details-rent" element={<ListingDetails_rent />} />
        <Route path="/sellerListing-sell" element={<SellerListingSell />} />
        <Route path="/sellerListing-rent" element={<SellerListingRent />} />
        <Route path="/admingListing" element={<AdmingListing />} />
        <Route path="/sellerUpdateListing" element={<UpdateListing />} />
        <Route path="/adminReviewSell" element={<AdminReviewSell />} />
        <Route path="/adminReviewRent" element={<AdminReviewRent />} />
        <Route path="/" element={<BuyerLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="search-results" element={<SearchResults />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="interests" element={<Interests />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
