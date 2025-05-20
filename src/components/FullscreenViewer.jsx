import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { FaTimes, FaChevronLeft, FaChevronRight, FaEye } from "react-icons/fa";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { incrementViewCount } from "../services/photoService";

function FullscreenViewer({ photos, currentIndex, onClose, onPrev, onNext }) {
  const currentPhoto = photos[currentIndex];
  const viewedPhotosRef = useRef(new Set());

  useEffect(() => {
    if (currentPhoto?.id && !viewedPhotosRef.current.has(currentPhoto.id)) {
      viewedPhotosRef.current.add(currentPhoto.id);
      incrementViewCount(currentPhoto.id);
    }

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [currentPhoto?.id]);

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl hover:text-red-400"
      >
        <FaTimes />
      </button>

      <button
        onClick={onPrev}
        className={classNames(
          "absolute left-4 text-white text-3xl p-2 hover:text-primary",
          {
            "opacity-50 cursor-not-allowed": currentIndex === 0,
          }
        )}
        disabled={currentIndex === 0}
      >
        <FaChevronLeft />
      </button>

      <div className="fixed inset-0 z-50 bg-background bg-opacity-95 flex items-center justify-center">
        <div className="max-w-full max-h-full px-4 text-center">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.name}
            className="max-h-[80vh] max-w-[90vw] object-contain mx-auto rounded"
          />

          <div className="text-white mt-4 space-y-1 text-sm">
            <div>
              <span className="block font-semibold text-primary">
                Fecha de captura
              </span>
              {formattedDate}
            </div>

            <div className="flex justify-center items-center gap-1 mt-1 text-xs text-secondary">
              <FaEye className="inline" />
              <span>Vistas: {currentPhoto.views ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className={classNames(
          "absolute right-4 text-white text-3xl p-2 hover:text-primary",
          {
            "opacity-50 cursor-not-allowed": currentIndex === photos.length - 1,
          }
        )}
        disabled={currentIndex === photos.length - 1}
      >
        <FaChevronRight />
      </button>
    </div>,
    document.body
  );
}

export default FullscreenViewer;
