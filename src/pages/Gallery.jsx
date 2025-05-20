import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../services/firebase";
import PhotoCard from "../components/PhotoCard";
import FullscreenViewer from "../components/FullscreenViewer";
import WelcomeModal from "../components/WelcomeModal";

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const photosRef = ref(database, "photos");
    onValue(photosRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));
      setPhotos(list.sort((a, b) => b.date - a.date));
    });

    setShowWelcome(true);
  }, []);

  const handlePhotoClick = (index) => {
    setSelectedIndex(index);
  };

  const handleOpenFromWelcome = (photo) => {
    const index = photos.findIndex((p) => p.id === photo.id);
    if (index !== -1) {
      setSelectedIndex(index);
    }
  };

  const closeViewer = () => setSelectedIndex(null);
  const goPrev = () => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
  const goNext = () =>
    setSelectedIndex((prev) => (prev < photos.length - 1 ? prev + 1 : prev));

  return (
    <div className="min-h-screen bg-background text-white p-4">
      {showWelcome && (
        <WelcomeModal
          onClose={() => setShowWelcome(false)}
          onOpenFullscreen={handleOpenFromWelcome}
        />
      )}

      <h1 className="text-2xl font-bold text-primary mb-4 text-center">
        Galería
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            selected={false}
            onClick={() => handlePhotoClick(index)}
          />
        ))}
      </div>

      {selectedIndex !== null && (
        <FullscreenViewer
          photos={photos}
          currentIndex={selectedIndex}
          onClose={closeViewer}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </div>
  );
}

export default Gallery;
