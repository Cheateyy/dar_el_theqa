import ImageCarousel from "../../components/common/ImageCarousel/ImageCarousel.jsx";
export default function ImageSection({ images }) {
    return (
        <div className="admin-rent-imageScroller">
            <ImageCarousel images={images} />
        </div>
    );
}
