import deleteImg from '../../../assets/images/delete-btn-icon.png';

const reviews = [
  {
    name: "John Doe",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed neque id libero pretium varius non et risus.",
    date: "Jun 24, 2025",
    stars: 5,
  },
  {
    name: "Jane Smith",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed neque id libero pretium varius non et risus.",
    date: "Jun 24, 2025",
    stars: 4,
  },
  {
    name: "Alice Johnson",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed neque id libero pretium varius non et risus.",
    date: "Jun 24, 2025",
    stars: 5,
  },
  {
    name: "Bob Williams",
    text: "Extra review, should not appear in top 3",
    date: "Jun 25, 2025",
    stars: 3,
  },
];

export default function Reviews({ allow_Delete }) {
  return (
    <div className="rent-reviewsSection cardWrapper">
      <h2>Top Reviews</h2>
      <div className="rent-reviewsCardsContainer">
        {reviews.slice(0, 3).map((review, idx) => (
          <div className="rent-reviewCard" key={idx}>
            <div className="rent-reviewContent">
              <div className="reviewTop">
                <h3>{review.name}</h3>
                {allow_Delete && (
                  <button className="deleteReviewButton"><img src={deleteImg} alt="" /></button>
                )}
              </div>
              
              <p>{review.text}</p>
              <span className="rent-reviewDate">{review.date}</span>
              <div className="rent-reviewStars">
                {"★".repeat(review.stars) + "☆".repeat(5 - review.stars)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
