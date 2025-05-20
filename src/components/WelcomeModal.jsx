import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ref, onValue } from "firebase/database";
import { database } from "../services/firebase";

const phrases = [
  "Tu mirada habita en cada rincón de mi memoria.",
  "Eras tú… incluso antes de conocerte.",
  "Donde termina la luz, comienza tu nombre.",
  "Tu recuerdo es la única foto que no se borra.",
  "Entre miles de capturas, sólo tú me enfocas.",
  // Agrega más frases si gustas
];

function WelcomeModal({ onClose, onOpenFullscreen }) {
  const [randomPhoto, setRandomPhoto] = useState(null);
  const [randomPhrase, setRandomPhrase] = useState("");

  useEffect(() => {
    const photosRef = ref(database, "photos");
    onValue(photosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const photoList = Object.values(data);
        const random = photoList[Math.floor(Math.random() * photoList.length)];
        setRandomPhoto(random);
      }
    });

    const random = phrases[Math.floor(Math.random() * phrases.length)];
    setRandomPhrase(random);
  }, []);

  if (!randomPhoto) return null;

  const handleOpen = () => {
    onOpenFullscreen(randomPhoto);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-surface text-white p-6 rounded-xl shadow-xl max-w-md w-full text-center">
        <img
          src={randomPhoto.url}
          alt={randomPhoto.name}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <p className="italic text-secondary mb-6">{randomPhrase}</p>
        <button
          onClick={handleOpen}
          className="bg-primary text-white py-2 px-4 rounded hover:bg-orange-500 transition"
        >
          Ver en galería
        </button>
      </div>
    </div>,
    document.body
  );
}

export default WelcomeModal;
