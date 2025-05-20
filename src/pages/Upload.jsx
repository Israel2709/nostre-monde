import UploadForm from "../components/UploadForm";

function Upload() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-surface w-full max-w-xl p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-secondary mb-6 text-center">
          Subir nueva foto
        </h1>
        <UploadForm />
      </div>
    </div>
  );
}

export default Upload;
