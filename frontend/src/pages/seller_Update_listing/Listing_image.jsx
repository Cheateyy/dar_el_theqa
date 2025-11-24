import { useRef } from 'react';
import './Listing.css';

export default function ListingImage({ images = [], setImages }) {
    const fileInputRef = useRef(null);

    const handleAddClick = () => {
        if (images.length >= 20) return;
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && setImages) {
            setImages([...images, { id: Date.now(), label: '', image: file }]);
        }
        e.target.value = null;
    };

    const handleLabelChange = (id, value) => {
        setImages(images.map(item => item.id === id ? { ...item, label: value } : item));
    };

    const handleRemove = (id) => {
        setImages(images.filter(item => item.id !== id));
    };

    return (
        <div className="seller-update-listing-card">
            <div className="seller-update-upload-header">
                <div className="seller-update-instructions">
                    <h2>Images and Labels</h2>
                    <p>Add up to 20 images. Labels are optional.</p>
                </div>
                <div className="seller-update-add-image">
                    <button type="button" onClick={handleAddClick}>+</button>
                </div>
            </div>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <div className="seller-update-listing-images">
                {images.map(item => (
                    <div key={item.id} className="seller-update-listing-item">
                        <label htmlFor={`label-${item.id}`}>Label</label>
                        <input
                            id={`label-${item.id}`}
                            type="text"
                            placeholder="Enter label..."
                            value={item.label}
                            onChange={e => handleLabelChange(item.id, e.target.value)}
                        />
                        <div className="seller-update-image-preview">
                            <img src={URL.createObjectURL(item.image)} alt="preview" />
                            <button className="seller-update-remove-image" type="button" onClick={() => handleRemove(item.id)}>×</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
