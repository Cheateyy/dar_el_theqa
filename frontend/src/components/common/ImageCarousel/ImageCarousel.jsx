import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import "./ImageCarousel.css";

export default function ImageCarousel({ images }) {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState(null); // image for fullscreen

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  const scrollTo = (index) => {
    if (emblaApi) emblaApi.scrollTo(index);
  };

  const openFullscreen = (src) => setFullscreenImage(src);

  const closeFullscreen = () => setFullscreenImage(null);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {images.map((src, index) => (
            <div className="embla__slide" key={index}>
              <img
                className="embla__slide__img"
                src={src}
                alt=""
                onClick={() => openFullscreen(src)}
                style={{ cursor: "pointer" }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="embla__dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`embla__dot ${index === selectedIndex ? "is-selected" : ""}`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>


      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={closeFullscreen}>
          <img className="fullscreen-image" src={fullscreenImage} alt="" />
        </div>
      )}
    </div>
  );
}
