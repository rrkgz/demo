import { useState, useEffect } from 'react';

interface ImageCarouselProps {
  images: string[];
  autoPlayInterval?: number;
}

export default function ImageCarousel({ images, autoPlayInterval = 4000 }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [images.length, autoPlayInterval]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  console.log('ImageCarousel renderizado con', images.length, 'imágenes');
  console.log('Imagen actual:', images[currentIndex]);

  return (
    <div className="position-relative rounded-4 shadow-lg overflow-hidden" style={{ 
      width: '100%',
      height: '450px',
      maxHeight: '450px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* Imagen actual con padding interno */}
      <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ padding: '12px' }}>
        <img 
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="rounded-3 shadow"
          style={{ 
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            display: 'block'
          }}
          onLoad={() => console.log('✓ Imagen cargada:', images[currentIndex])}
          onError={(e) => console.error('✗ Error cargando:', images[currentIndex])}
        />
      </div>

      {/* Overlay oscuro sutil */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ 
        background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
        zIndex: 2
      }} />

      {/* Botón anterior */}
      <button 
        onClick={goToPrevious}
        className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3 rounded-circle shadow-lg border-0"
        style={{ 
          width: 55, 
          height: 55,
          opacity: 0.95,
          zIndex: 10,
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255,255,255,0.9)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        aria-label="Imagen anterior"
      >
        <i className="bi bi-chevron-left fs-3 fw-bold"></i>
      </button>

      {/* Botón siguiente */}
      <button 
        onClick={goToNext}
        className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle shadow-lg border-0"
        style={{ 
          width: 55, 
          height: 55,
          opacity: 0.95,
          zIndex: 10,
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255,255,255,0.9)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        aria-label="Siguiente imagen"
      >
        <i className="bi bi-chevron-right fs-3 fw-bold"></i>
      </button>

      {/* Indicadores */}
      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 d-flex gap-2" style={{ zIndex: 10 }}>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="rounded-pill border-0 shadow-sm"
            style={{
              width: index === currentIndex ? 30 : 12,
              height: 12,
              backgroundColor: index === currentIndex ? '#fff' : 'rgba(255,255,255,0.6)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)'
            }}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
