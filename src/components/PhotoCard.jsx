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
        "rounded overflow-hidden cursor-pointer transition-transform transform hover:scale-105 shadow-md bg-surface",
        {
          "ring-4 ring-secondary": selected,
        }
      )}
    >
      <img
        src={photo.url}
        alt={photo.name}
        className="w-full h-48 object-cover"
      />

      <div className="bg-black/60 text-white text-xs p-2">
        <p className="font-semibold text-primary">Fecha de captura</p>
        <p>{formattedDate}</p>

        {/*<div className="flex items-center gap-1 mt-1 text-secondary">
          <FaEye />
          <span>{photo.views ?? 0} vistas</span>
        </div>*/}
      </div>
    </div>
  );
}

export default PhotoCard;
