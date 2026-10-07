/**
 * Utility to process, preview, and compress receipt and proof images
 * for browser storage and fast transmission.
 */

export const processReceiptImage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    const isImage = file.type.startsWith('image/');

    if (!isImage) {
      // Non-image file (e.g. PDF)
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          dataUrl: reader.result,
          name: file.name,
          size: file.size,
          type: file.type || 'application/pdf',
          isImage: false,
          previewUrl: null,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    // Process image: resize to max 1200px width/height to keep storage optimal and quality crisp
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to JPEG with 0.82 compression for crisp proof reading
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          const estimatedSize = Math.round((compressedDataUrl.length * 3) / 4);

          resolve({
            dataUrl: compressedDataUrl,
            previewUrl: compressedDataUrl,
            name: file.name,
            size: estimatedSize,
            type: 'image/jpeg',
            isImage: true,
          });
        } catch {
          // If canvas fails (e.g. SVG or security), fallback to raw dataUrl
          resolve({
            dataUrl: e.target.result,
            previewUrl: e.target.result,
            name: file.name,
            size: file.size,
            type: file.type,
            isImage: true,
          });
        }
      };
      img.onerror = () => {
        resolve({
          dataUrl: e.target.result,
          previewUrl: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type,
          isImage: true,
        });
      };
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

