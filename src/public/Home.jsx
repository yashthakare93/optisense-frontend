import React, { useState, useEffect } from 'react';

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = ["/Banner1.jpg", "/Banner3.jpg", "/Banner2.jpg"];

  const categories = [
    { name: 'Eyeglasses', img: '/eyeglasses.webp', promo: '50% OFF' },
    { name: 'Sunglasses', img: '/sunglasses.webp', promo: '40% OFF' },
    { name: 'Special Power', img: '/computerglasses.webp', promo: null },
    { name: 'Contact Lenses', img: '/contactlens.webp', promo: null },
    { name: 'Kids Glasses', img: '/kidglasses.webp', promo: '30% OFF' },
    { name: 'Sale', img: '/sale.webp', promo: '60% OFF' }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1)), 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => setCurrentSlide(currentSlide === banners.length - 1 ? 0 : currentSlide + 1);
  const prevSlide = () => setCurrentSlide(currentSlide === 0 ? banners.length - 1 : currentSlide - 1);

  return (
    <div className="w-100 bg-white overflow-hidden">
      {/* 1. BANNER CAROUSEL */}
      <div className="carousel slide" style={{ height: '500px' }}>
        <div className="carousel-inner h-100">
          {banners.map((url, index) => (
            <div key={index} className={`carousel-item h-100 ${index === currentSlide ? 'active' : ''}`}>
              <img src={url} className="d-block w-100 h-100" style={{ objectFit: 'cover' }} alt="Banner" />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" onClick={prevSlide}><span className="carousel-control-prev-icon"></span></button>
        <button className="carousel-control-next" onClick={nextSlide}><span className="carousel-control-next-icon"></span></button>
      </div>

      {/* 2. TOP CATEGORIES */}
      <section className="container-fluid px-4 px-lg-5 py-5">
        <div className="mx-auto" style={{ maxWidth: '1440px' }}>
          <h2 className="fw-bold text-uppercase mb-5" style={{ color: '#000042', fontSize: '24px', letterSpacing: '1px' }}>
            Top Categories
          </h2>

          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-4">
            {categories.map((cat, i) => (
              <div key={i} className="col">
                <div className="text-center" style={{ cursor: 'pointer' }}>
                  
                  {/* 3D CATEGORY BOX */}
                  <div
                    className="bg-white rounded-4 border border-light position-relative d-flex align-items-center justify-content-center mx-auto overflow-hidden shadow-sm"
                    style={{ 
                      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      padding: '12px',
                      height: 'auto',
                      minHeight: '130px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                      e.currentTarget.style.borderColor = '#000042';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';
                      e.currentTarget.style.borderColor = '#f8f9fa';
                    }}
                  >
                    <img src={cat.img} alt={cat.name} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />

                    {/* ROTATED RIBBON PROMO */}
                    {cat.promo && (
                      <div
                        className="position-absolute bg-primary text-white fw-bold shadow-sm d-flex align-items-center justify-content-center"
                        style={{ 
                          top: '12px', left: '-25px', fontSize: '9px', width: '100px', height: '22px',
                          transform: 'rotate(-45deg)', zIndex: 10, textTransform: 'uppercase'
                        }}
                      >
                        {cat.promo}
                      </div>
                    )}
                  </div>

                  <p className="fw-bold text-dark mt-4 mb-0 text-uppercase" style={{ fontSize: '11px' }}>
                    {cat.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
export default HomePage;