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
  "Para volver al centro me hacen falta tus ojos...",
  "Soy aquel que ni entre sueños te olvida...",
  "Podría gritar que me dejes beber de tu sangre...",
  "Me complace amarte, disfruto acariciarte, y ponerte a dormir",
  "No te fallaré, contigo yo quiero envejecer",
];

function WelcomeModal({ onClose, onOpenFullscreen }) {
  const [randomPhoto, setRandomPhoto] = useState(null);
  const [randomPhrase, setRandomPhrase] = useState("");
  const [visible, setVisible] = useState(true);

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

  const handleClose = () => {
    // Inicia animación de salida
    setVisible(false);
    // Espera a que termine la transición para cerrar completamente
    setTimeout(onClose, 300); // tiempo igual a la duración del transition
  };

  const handleOpen = () => {
    onOpenFullscreen(randomPhoto);
    handleClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div
        className={`bg-surface text-white p-6 rounded-xl shadow-xl max-w-md w-full text-center transition-all duration-300 ease-out transform ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Imagen */}
        <img
          src={randomPhoto.url}
          alt={randomPhoto.name}
          className="w-full h-64 object-cover rounded mb-4"
        />

        {/* Frase */}
        <p className="italic text-secondary mb-6">{randomPhrase}</p>

        {/* Botones */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleOpen}
            className="bg-primary text-white py-2 px-4 rounded hover:bg-orange-500 transition"
          >
            Ver en galería
          </button>
          <button
            onClick={handleClose}
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-500 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default WelcomeModal;
