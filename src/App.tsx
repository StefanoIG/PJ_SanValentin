import { useState, useEffect } from 'react';

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isInitialAnimation, setIsInitialAnimation] = useState(true);

  useEffect(() => {
    setIsOpen(false);
    setShowModal(false);

    // Limpiar y establecer el estado de animación
    const timer = setTimeout(() => {
      setIsInitialAnimation(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = () => {
    setIsOpen(true);
    setShowModal(true);
  };

  // Función para generar puntos de clip-path aleatorios pero suaves
  const generateScrollPath = () => {
    const points = [];
    points.push('0% 10%');
    for (let i = 0; i <= 10; i++) {
      const x = i * 10;
      const y = 10 + Math.sin(i) * 2;
      points.push(`${x}% ${y}%`);
    }
    for (let i = 10; i <= 90; i += 10) {
      const x = 100 + Math.sin(i * 0.1) * 2;
      points.push(`${x}% ${i}%`);
    }
    for (let i = 10; i >= 0; i--) {
      const x = i * 10;
      const y = 90 + Math.sin(i) * 2;
      points.push(`${x}% ${y}%`);
    }
    for (let i = 90; i >= 10; i -= 10) {
      const x = Math.sin(i * 0.1) * 2;
      points.push(`${x}% ${i}%`);
    }
    return `polygon(${points.join(', ')})`;
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(to bottom, rgba(255, 182, 193, 0.8), rgba(255, 105, 180, 0.8))
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={`flower-${i}`}
            className="absolute w-12 h-12 bg-pink-200 flower animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          ></div>
        ))}

        {[...Array(10)].map((_, i) => (
          <div
            key={`heart-${i}`}
            className="absolute w-8 h-8 bg-red-500 heart animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      <div
        className={`relative w-96 h-64 bg-pink-100 rounded-lg shadow-2xl flex items-center justify-center p-8 transform transition-all duration-500 cursor-pointer ${isInitialAnimation ? 'animate-card-entry' : 'animate-float hover:rotate-0 rotate-2'
          }`}
        style={{
          border: '2px solid rgba(255, 182, 193, 0.5)',
        }}
        onMouseEnter={() => !isOpen && setIsOpen(true)}
        onMouseLeave={() => !showModal && setIsOpen(false)}
        onClick={handleCardClick}
      >
        <div
          className={`absolute -right-24 top-1/2 transform -translate-y-1/2 bg-white px-4 py-2 rounded-full shadow-lg transition-opacity duration-300 ${isOpen && !showModal ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <p className="text-pink-500 font-semibold">¡Ábreme!</p>
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 rotate-45 w-4 h-4 bg-white"></div>
        </div>

        <div
          className="absolute top-0 left-0 w-full h-24 transition-transform duration-500"
          style={{
            clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
            background: 'rgba(255, 192, 203, 0.9)',
            borderLeft: '2px solid rgba(255, 182, 193, 0.8)',
            borderRight: '2px solid rgba(255, 182, 193, 0.8)',
            borderTop: '2px solid rgba(255, 182, 193, 0.8)',
            transformOrigin: 'top',
            transform: isOpen ? 'rotateX(180deg)' : 'rotateX(0)',
            zIndex: 10,
          }}
        >
          <div
            className="absolute w-6 h-6 bg-red-500 heart"
            style={{
              clipPath: 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")',
              animation: 'pulse 1.5s infinite',
              top: '75%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          ></div>
        </div>

        <div className="absolute inset-2 border-2 border-pink-200 rounded-lg opacity-50"></div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-0"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative max-w-3xl w-full mx-auto transform transition-all cursor-default animate-sway"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10 shadow-lg"
            >
              ×
            </button>

            <div
              className="w-full bg-white overflow-hidden transform transition-all rounded-2xl"
              style={{
                boxShadow: '0 10px 25px rgba(0,0,0,0.2), 0 0 0 2px #FFB6C1'
              }}
            >
              {/* Rosa mejorada con múltiples pétalos */}
              <div className="absolute top-6 right-6">
                <div className="relative w-24 h-24">
                  {/* Tallo */}
                  <div className="absolute w-1.5 h-24 bg-green-600 left-1/2 top-16 -translate-x-1/2 rotate-12"></div>

                  {/* Hojas */}
                  <div className="absolute w-8 h-5 bg-green-500 rounded-full -rotate-45 left-1/2 top-20 transform -translate-x-full"></div>
                  <div className="absolute w-8 h-5 bg-green-500 rounded-full rotate-45 left-1/2 top-24 transform"></div>

                  {/* Pétalos internos */}
                  <div className="absolute inset-0 animate-spin-slow">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={`inner-${i}`}
                        className="absolute w-8 h-8 bg-pink-400 rounded-full origin-center"
                        style={{
                          transform: `rotate(${i * 60}deg) translateY(-6px)`,
                          filter: 'brightness(0.95)',
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* Pétalos medios */}
                  <div className="absolute inset-0 animate-spin-slow" style={{ animationDelay: '-2s' }}>
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={`middle-${i}`}
                        className="absolute w-10 h-10 bg-pink-300 rounded-full origin-center"
                        style={{
                          transform: `rotate(${i * 45}deg) translateY(-8px)`,
                          filter: 'brightness(0.9)',
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* Pétalos externos */}
                  <div className="absolute inset-0 animate-spin-slow" style={{ animationDelay: '-4s' }}>
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={`outer-${i}`}
                        className="absolute w-12 h-12 bg-pink-200 rounded-full origin-center"
                        style={{
                          transform: `rotate(${i * 36}deg) translateY(-10px)`,
                          filter: 'brightness(0.85)',
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* Centro de la rosa */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-pink-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="relative p-12 md:p-16 max-h-[80vh] overflow-y-auto">
                <p
                  className="text-gray-800 font-serif text-xl md:text-2xl leading-relaxed text-center relative z-10 whitespace-pre-wrap"
                  style={{
                    fontFamily: "'Noto Serif', serif"
                  }}
                >
                  Espero que estés mejorando y sanando poco a poco. Sé que el proceso no siempre es fácil, pero quiero recordarte lo increíble que eres y lo mucho que vales. Hay personas en este mundo que te aprecian más de lo que imaginas (y sí, me incluyo entre ellas).

                  Hice esto en mis tiempos libres para poder sacarate una sonrisa. Ya que estoy muy seguro de que te ves hermosa cuando sonríes.

                  Sigue brillando a tu manera, que el mundo es un lugar mejor con alguien como tú en él.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;