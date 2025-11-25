import { useState } from "react";
import './ListingDetails.css'

export default function SubmitReview() {
  const [stars, setStars] = useState(0); 
  const [hover, setHover] = useState(0); 
  const [review, setReview] = useState(""); 

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
        />
        <div className="rent-reviewStarsInput">
          <div className="rent-starsSelect">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= (hover || stars) ? "rent-star filled" : "rent-star"}
                onClick={() => setStars(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </span>
            ))}
          </div>
          <button className="rent-submitReviewButton">Submit</button>
        </div>
      </div>
    </div>
  );
}
