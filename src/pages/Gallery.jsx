import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { ref, onValue } from "firebase/database";
import PhotoCard from "../components/PhotoCard";
import FullscreenViewer from "../components/FullscreenViewer";

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

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
  }, []);

  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="text-2xl font-bold text-primary mb-4">Galería</h1>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            selected={false}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>

      {selectedIndex !== null && (
        <FullscreenViewer
          photos={photos}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onPrev={() => setSelectedIndex((i) => (i > 0 ? i - 1 : i))}
          onNext={() =>
            setSelectedIndex((i) => (i < photos.length - 1 ? i + 1 : i))
          }
        />
      )}
    </div>
  );
}

export default Gallery;
