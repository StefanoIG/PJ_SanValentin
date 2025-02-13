import { useState, useEffect } from 'react';

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isInitialAnimation, setIsInitialAnimation] = useState(false);

  useEffect(() => {
    setIsOpen(false);
    setShowModal(false);

    // Manejo de la animación inicial
    const hasAnimated = sessionStorage.getItem('hasAnimated');
    if (!hasAnimated) {
      setIsInitialAnimation(true);
      sessionStorage.setItem('hasAnimated', 'true');
      
      // Remover la clase de animación después de que termine
      const timer = setTimeout(() => {
        setIsInitialAnimation(false);
      }, 2000); // 2 segundos de duración de la animación
      
      return () => clearTimeout(timer);
    }
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
        className={`relative w-96 h-64 bg-pink-100 rounded-lg shadow-2xl flex items-center justify-center p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500 animate-float group cursor-pointer ${
          isInitialAnimation ? 'animate-card-entry' : ''
        }`}
        style={{
          animation: isInitialAnimation ? 'none' : 'float 4s ease-in-out infinite',
          border: '2px solid rgba(255, 182, 193, 0.5)',
        }}
        onMouseEnter={() => !isOpen && setIsOpen(true)}
        onMouseLeave={() => !showModal && setIsOpen(false)}
        onClick={handleCardClick}
      >
        <div
          className={`absolute -right-24 top-1/2 transform -translate-y-1/2 bg-white px-4 py-2 rounded-full shadow-lg transition-opacity duration-300 ${
            isOpen && !showModal ? 'opacity-100' : 'opacity-0'
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
            className="relative max-w-lg w-full mx-auto transform transition-all cursor-default animate-sway"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10 shadow-lg"
            >
              ×
            </button>

            <div
              className="w-full bg-[#f4e4bc] overflow-hidden transform transition-all"
              style={{
                clipPath: generateScrollPath(),
                backgroundImage: `
                  radial-gradient(circle at top left, #d4b483 0%, transparent 20%),
                  radial-gradient(circle at top right, #d4b483 0%, transparent 20%),
                  radial-gradient(circle at bottom left, #d4b483 0%, transparent 20%),
                  radial-gradient(circle at bottom right, #d4b483 0%, transparent 20%),
                  url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")
                `,
                boxShadow: `
                  0 0 0 2px #f4e4bc,
                  0 10px 25px rgba(0,0,0,0.3),
                  inset 0 0 60px rgba(139,69,19,0.3)
                `
              }}
            >
              <div className="relative p-8 md:p-12 max-h-[80vh] overflow-y-auto">
                <div
                  className="absolute top-0 left-0 w-full h-24"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(139,69,19,0.2), transparent)',
                    pointerEvents: 'none'
                  }}
                ></div>

                <p
                  className="text-[#4a2810] font-serif text-lg md:text-xl leading-relaxed text-center relative z-10 whitespace-pre-wrap"
                  style={{
                    textShadow: '1px 1px 2px rgba(139,69,19,0.1)',
                    fontFamily: "'Noto Serif', serif"
                  }}
                >
                  Espero que estés mejorando y sanando poco a poco. Sé que el proceso no siempre es fácil, pero quiero recordarte lo increíble que eres y lo mucho que vales. Hay personas en este mundo que te aprecian más de lo que imaginas (y sí, me incluyo entre ellas).

Hice esto en mis tiempos libres con la esperanza de sacarte una sonrisa. Si lo logré, entonces valió la pena. Y si no, bueno… al menos lo intenté.

Sigue brillando a tu manera, que el mundo es un lugar mejor con alguien como tú en él.
                </p>

                <div
                  className="absolute bottom-0 left-0 w-full h-24"
                  style={{
                    background: 'linear-gradient(to top, rgba(139,69,19,0.2), transparent)',
                    pointerEvents: 'none'
                  }}
                ></div>

                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      repeating-linear-gradient(
                        to right,
                        transparent,
                        transparent 50px,
                        rgba(139,69,19,0.03) 50px,
                        rgba(139,69,19,0.03) 51px
                      )
                    `,
                    pointerEvents: 'none'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;