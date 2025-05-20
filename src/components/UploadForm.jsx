import { useForm } from "react-hook-form";
import { useState } from "react";
import { storage, database } from "../services/firebase";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { ref as dbRef, push, set } from "firebase/database";
import { FaCheckCircle } from "react-icons/fa";
import classNames from "classnames";
import * as exifr from "exifr";

function UploadForm() {
  const { register, handleSubmit, reset } = useForm();
  const [previewImages, setPreviewImages] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }));
    setPreviewImages(previews);
    setProgressMap({});
  };

  const onSubmit = async () => {
    setIsLoading(true);
    setSuccess(false);
    setProgressMap({});

    for (const image of previewImages) {
      const file = image.file;
      const fileRef = storageRef(storage, `photos/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgressMap((prev) => ({ ...prev, [file.name]: percent }));
        },
        (error) => {
          console.error(`Error al subir ${file.name}:`, error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          const exif = await exifr.parse(file, ["DateTimeOriginal"]);
          const photoDate = exif?.DateTimeOriginal?.getTime?.() || Date.now();

          // Crea una referencia nueva y guarda el ID
          const newPhotoRef = push(dbRef(database, "photos"));
          const photoId = newPhotoRef.key;

          const metadata = {
            id: photoId,
            url,
            name: file.name,
            date: photoDate,
            views: 0, // 👈 contador inicial
          };

          await set(newPhotoRef, metadata);

          setProgressMap((prev) => ({ ...prev, [file.name]: 100 }));
        }
      );
    }

    setIsLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setPreviewImages([]);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <label className="block">
        <span className="text-gray-700 font-medium">Selecciona imágenes</span>
        <input
          type="file"
          multiple
          accept="image/*"
          {...register("photos")}
          onChange={handleFileChange}
          className="mt-2 block w-full text-sm text-white bg-surface file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-orange-600 transition"
        />
      </label>

      {previewImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {previewImages.map((img) => (
            <div
              key={img.name}
              className="rounded overflow-hidden border border-gray-200 shadow-sm p-2"
            >
              <img
                src={img.url}
                alt={img.name}
                className="object-cover h-28 w-full rounded"
              />
              <p className="text-xs text-center truncate mt-1">{img.name}</p>
              {progressMap[img.name] != null && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-secondary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressMap[img.name]}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={classNames(
          "mt-4 py-3 rounded-lg font-semibold transition shadow-md text-white",
          {
            "bg-orange-400 cursor-not-allowed": isLoading,
            "bg-primary hover:bg-orange-600": !isLoading,
          }
        )}
      >
        {isLoading ? "Subiendo..." : "Subir"}
      </button>

      {success && (
        <div className="flex items-center gap-2 text-green-600 font-medium mt-2 justify-center">
          <FaCheckCircle />
          ¡Imágenes subidas exitosamente!
        </div>
      )}
    </form>
  );
}

export default UploadForm;
