import { useState } from "react";
import "./ListingDetails.css";

export default function SubmitReview({ onSubmit, isSubmitting = false }) {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = async () => {
    if (!onSubmit) {
      return;
    }
    if (!stars) {
      window.alert("Please select a rating before submitting.");
      return;
    }
    if (!review.trim()) {
      window.alert("Please add a short comment.");
      return;
    }
    try {
      await onSubmit({ rating: stars, comment: review.trim() });
      setStars(0);
      setHover(0);
      setReview("");
    } catch (error) {
      console.error("Failed to submit review", error);
      window.alert("Unable to submit your review right now. Please try again.");
    }
  };

  return (
    <div className="rent-submitReviewWrapper cardWrapper">
      <h2>Leave a review</h2>
      <div className="rent-submitReviewContent">
        <input
          type="text"
          className="rent-reviewInput"
          placeholder="Write your review here"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          disabled={isSubmitting}
        />
        <div className="rent-reviewStarsInput">
          <div className="rent-starsSelect">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= (hover || stars) ? "rent-star filled" : "rent-star"}
                onClick={() => !isSubmitting && setStars(star)}
                onMouseEnter={() => !isSubmitting && setHover(star)}
                onMouseLeave={() => !isSubmitting && setHover(0)}
              >
                ★
              </span>
            ))}
          </div>
          <button className="rent-submitReviewButton" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
