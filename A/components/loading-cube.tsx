"use client"

export default function LoadingCube() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[var(--background)] via-[var(--secondary)] to-[var(--primary)] flex items-center justify-center">
      <div className="text-center">
        <div className="cube-container mb-8">
          <div className="cube">
            <div className="face front"></div>
            <div className="face back"></div>
            <div className="face right"></div>
            <div className="face left"></div>
            <div className="face top"></div>
            <div className="face bottom"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">در حال بارگذاری...</h2>
        <p className="text-muted-foreground">عالم عناصر در حال آماده‌سازی است</p>
      </div>

      <style jsx>{`
        .cube-container {
          perspective: 1000px;
          width: 100px;
          height: 100px;
          margin: 0 auto;
        }

        .cube {
          position: relative;
          width: 100px;
          height: 100px;
          transform-style: preserve-3d;
          animation: rotate 5s infinite linear;
        }

        .face {
          position: absolute;
          width: 100px;
          height: 100px;
          background: linear-gradient(45deg, var(--primary), var(--accent), var(--primary));
          border: 2px solid rgba(255, 255, 255, 0.3);
          opacity: 0.8;
        }

        .front {
          transform: rotateY(0deg) translateZ(50px);
        }

        .back {
          transform: rotateY(180deg) translateZ(50px);
        }

        .right {
          transform: rotateY(90deg) translateZ(50px);
        }

        .left {
          transform: rotateY(-90deg) translateZ(50px);
        }

        .top {
          transform: rotateX(90deg) translateZ(50px);
        }

        .bottom {
          transform: rotateX(-90deg) translateZ(50px);
        }

        @keyframes rotate {
          0% {
            transform: rotateX(0deg) rotateY(0deg);
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg);
          }
        }
      `}</style>
    </div>
  )
}
