import React from 'react';

const RotatingLogo = ({ opacity = 0.18, size = 'default' }) => {
  const sizeMap = {
    small: 'clamp(200px, 35vw, 300px)',
    default: 'clamp(260px, 45vw, 380px)',
    large: 'clamp(320px, 55vw, 480px)'
  };

  return (
    <>
      <style>{`
        .hero-logo-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          pointer-events: none;
          opacity: ${opacity};
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .hero-logo-3d {
          width: ${sizeMap[size]};
          height: ${sizeMap[size]};
          object-fit: contain;
          filter: drop-shadow(0 0 50px rgba(0, 229, 255, 0.7));
          animation: floatAndRotate3D 12s infinite linear;
          transform-style: preserve-3d;
        }

        @keyframes floatAndRotate3D {
          0% {
            transform: translateY(0px) rotateY(0deg) rotateX(10deg);
          }
          50% {
            transform: translateY(-20px) rotateY(180deg) rotateX(-10deg);
          }
          100% {
            transform: translateY(0px) rotateY(360deg) rotateX(10deg);
          }
        }
      `}</style>

      <div className="hero-logo-container">
        <img src="/logo.png?v=4" className="hero-logo-3d" alt="Hadescore Apex Logo" />
      </div>
    </>
  );
};

export default RotatingLogo;
