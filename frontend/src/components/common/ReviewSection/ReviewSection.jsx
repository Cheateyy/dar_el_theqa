import deleteImg from '../../../assets/images/delete-btn-icon.png';

export default function Reviews({ allow_Delete = false, reviews = [], limit = 3, onDeleteReview }) {
  if (!reviews.length) return null;

  return (
    <div className="rent-reviewsSection cardWrapper">
      <h2>Top Reviews</h2>
      <div className="rent-reviewsCardsContainer">
        {reviews.slice(0, limit).map((review) => (
          <div className="rent-reviewCard" key={review.id}>
            <div className="rent-reviewContent">
              <div className="reviewTop" style={{ marginBottom: '5%' }}>
                {review.user_avatar ? (
                  <img
                    src={review.user_avatar}
                    alt={review.user_name}
                    className="review-avatar"
                    style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }}
                  />
                ) : (
                  <div
                    className="review-avatar"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      marginRight: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#dfe6ed',
                      color: '#0F405E',
                      fontWeight: 600,
                    }}
                  >
                    {(review.user_name || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <h3>{review.user_name}</h3>
                {allow_Delete && onDeleteReview && (
                  <button
                    className="deleteReviewButton"
                    type="button"
                    onClick={() => onDeleteReview(review.id)}
                    title="Delete review"
                  >
                    <img src={deleteImg} alt="Delete review" />
                  </button>
                )}
              </div>

              <p>{review.comment}</p>
              <span className="rent-reviewDate">{review.date}</span>
              <div className="rent-reviewStars">
                {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
