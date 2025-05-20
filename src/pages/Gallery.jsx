import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../services/firebase";
import PhotoCard from "../components/PhotoCard";
import FullscreenViewer from "../components/FullscreenViewer";
import WelcomeModal from "../components/WelcomeModal";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [groupedPhotos, setGroupedPhotos] = useState([]);
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

      const sorted = list.sort((a, b) => b.date - a.date);
      setPhotos(sorted);
      groupPhotosByMonth(sorted);
    });

    setShowWelcome(true);
  }, []);

  const groupPhotosByMonth = (photoList) => {
    const groups = {};

    photoList.forEach((photo) => {
      const date = new Date(photo.date);
      const key = format(date, "MMMM yyyy", { locale: es }); // ej: "mayo 2025"
      if (!groups[key]) groups[key] = [];
      groups[key].push(photo);
    });

    // Convertir a array ordenado
    const ordered = Object.entries(groups)
      .sort((a, b) => {
        const dateA = new Date(a[1][0].date);
        const dateB = new Date(b[1][0].date);
        return dateB - dateA;
      })
      .map(([label, photos]) => ({ label, photos }));

    setGroupedPhotos(ordered);
  };

  const handlePhotoClick = (photo) => {
    const index = photos.findIndex((p) => p.id === photo.id);
    setSelectedIndex(index);
  };

  const handleOpenFromWelcome = (photo) => {
    const index = photos.findIndex((p) => p.id === photo.id);
    if (index !== -1) {
      setSelectedIndex(index);
    }
  };

  const closeViewer = () => setSelectedIndex(null);
  const goPrev = () => setSelectedIndex((i) => (i > 0 ? i - 1 : i));
  const goNext = () =>
    setSelectedIndex((i) => (i < photos.length - 1 ? i + 1 : i));

  return (
    <div className="min-h-screen bg-background text-white p-4">
      {showWelcome && (
        <WelcomeModal
          onClose={() => setShowWelcome(false)}
          onOpenFullscreen={handleOpenFromWelcome}
        />
      )}

      <h1 className="text-2xl font-bold text-primary mb-6 text-center">
        Galería
      </h1>

      {groupedPhotos.map((group) => (
        <div key={group.label} className="mb-8">
          <h2 className="text-lg text-secondary font-semibold mb-2">
            {group.label.charAt(0).toUpperCase() + group.label.slice(1)}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {group.photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                selected={false}
                onClick={() => handlePhotoClick(photo)}
              />
            ))}
          </div>
        </div>
      ))}

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
