import classNames from "classnames";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FaEye } from "react-icons/fa";

function PhotoCard({ photo, selected, onClick }) {
  const formattedDate = format(
    new Date(photo.date),
    "d 'de' MMMM 'de' yyyy, h:mm a",
    { locale: es }
  );

  return (
    <div
      onClick={onClick}
      className={classNames(
        "cursor-pointer transform transition-transform hover:scale-105",
        {
          "ring-4 ring-secondary": selected,
        }
      )}
    >
      <div className="bg-white rounded-sm shadow-lg p-2 flex flex-col items-center justify-between h-full">
        {/* Imagen */}
        <div className="w-full aspect-[3/4] bg-gray-200 overflow-hidden rounded-sm">
          <img
            src={photo.url}
            alt={photo.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Marco inferior estilo Polaroid */}
        <div className="pt-3 text-center text-xl text-gray-700 w-full font-handwriting">
          <p className="font-semibold">Fecha de captura</p>
          <p>{formattedDate}</p>
        </div>
      </div>
    </div>
  );
}

export default PhotoCard;
