import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage"; 
const apiBaseUrl = import.meta.env.VITE_BASE_URL;

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [newFilename, setNewFilename] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const nameWithoutExt =
        selectedFile.name.substring(0, selectedFile.name.lastIndexOf(".")) ||
        selectedFile.name;
      setNewFilename(nameWithoutExt);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleUpload = async () => {
    if (!file || !newFilename.trim() || !croppedAreaPixels) return;

    setUploading(true);

    try {
      const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels);
      const extension = file.name.split(".").pop();
      const renamedFile = new File(
        [croppedBlob],
        `${newFilename}.${extension}`,
        { type: file.type }
      );

      const formData = new FormData();
      formData.append("symbol", renamedFile);

      const response = await fetch(`${apiBaseUrl}/upload-images`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`Uploaded: ${result.filename}`);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage("Error uploading file.");
    } finally {
      setUploading(false);
      setFile(null);
      setNewFilename("");
      setPreviewUrl(null);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-xl mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-semibold">Upload & Crop Image</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {previewUrl && (
        <div className="relative w-full h-64 bg-gray-200">
          <Cropper
            image={previewUrl}
            crop={crop}
            zoom={zoom}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
      )}

      {file && (
        <div className="text-sm text-gray-700">
          <p className="mt-2">
            Original filename: <strong>{file.name}</strong>
          </p>
          <label className="block mt-2">
            <span className="text-gray-600">Rename (without extension):</span>
            <input
              type="text"
              value={newFilename}
              onChange={(e) => setNewFilename(e.target.value)}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </label>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading || !newFilename.trim()}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {message && <p className="text-sm text-gray-800">{message}</p>}
    </div>
  );
};

export default UploadImage;
