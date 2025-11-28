import ImageCarousel from "../../components/common/ImageCarousel/ImageCarousel.jsx";
export default function ImageSection({ images }) {
    return (
        <div className="admin-sell-imageScroller">
            <ImageCarousel images={images} />
        </div>
    );
}
