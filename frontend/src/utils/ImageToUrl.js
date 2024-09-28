export const imageToUrl = (imageData) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = `data:image/png;base64,${imageData}`;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = image.width;
      canvas.height = image.height;

      // Draw the image on the canvas
      ctx.drawImage(image, 0, 0);

      // Convert canvas to data URL
      const imageUrl = canvas.toDataURL("image/png");

      resolve(imageUrl);
    };

    image.onerror = (err) => {
      console.error("Image load error:", err);
      reject(err);
    };
  });
};
