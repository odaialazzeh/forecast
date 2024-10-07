import React from "react";
import jsPDF from "jspdf";

const GeneratePDFComponent = ({
  user,
  selectedImage,
  updatedImages,
  imageStandard,
  imageStory,
  type,
  location,
  bedrooms,
  area,
  plotArea,
  email,
  loadingAdd,
}) => {
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = "anonymous"; // Handle cross-origin issues

      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Error loading the image."));
    });
  };

  const generatePDF = async () => {
    const pdf = new jsPDF();
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(50);

    let pdfHeight = 40; // This will dynamically update based on content height

    const selectedImgSrc =
      selectedImage === "standard"
        ? updatedImages.imageStandard || imageStandard
        : updatedImages.imageStory || imageStory;

    try {
      if (selectedImgSrc) {
        const selectedImage = await loadImage(selectedImgSrc);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = selectedImage.naturalWidth;
        canvas.height = selectedImage.naturalHeight;
        ctx.drawImage(selectedImage, 0, 0);

        const imgData = canvas.toDataURL("image/jpeg", 1);

        const pdfWidth = 160;
        const imgHeight =
          (selectedImage.naturalHeight / selectedImage.naturalWidth) *
          pdfWidth *
          1.4; // Increase height

        // Add house image to the PDF
        pdf.addImage(imgData, "JPEG", 25, 30, pdfWidth, imgHeight);

        // Update pdfHeight to position the next content below the image
        pdfHeight = imgHeight + 35; // Add 50px padding below the image
      }

      // Add the dynamic sentence before the line separator
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      const bedroomText =
        bedrooms === "studio" ? "studio" : `${bedrooms} bedroom(s)`;
      const plotAreaText = plotArea ? `and plot area ${plotArea} sqft` : "";

      const dynamicSentence = `Past 18 months, Upcoming 6 months for ${bedroomText} ${type} in ${location} with Built up area ${area} sqft ${plotAreaText}`;

      // Get the width of the text to calculate the center position
      const pageWidth = pdf.internal.pageSize.getWidth();
      const textWidth = pdf.getTextWidth(dynamicSentence);
      const xOffset = (pageWidth - textWidth) / 2; // Calculate the center X position

      pdf.text(dynamicSentence.trim(), xOffset, pdfHeight); // Add centered dynamic text

      pdfHeight += 10; // Adjust height after adding the dynamic sentence

      // Line separator under the dynamic text
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, pdfHeight, 190, pdfHeight);

      // User image below the house image (circular, using JPEG with white background)
      if (user.image) {
        const img = await loadImage(user.image);

        const diameter = 50; // Size of the circular image
        const imgCanvas = document.createElement("canvas");
        const imgCtx = imgCanvas.getContext("2d");

        // Set the canvas size to match the image's natural size
        imgCanvas.width = img.naturalWidth;
        imgCanvas.height = img.naturalHeight;

        // Fill the background with white to avoid transparency issues
        imgCtx.fillStyle = "white";
        imgCtx.fillRect(0, 0, imgCanvas.width, imgCanvas.height);

        // Clip the image to a circle
        imgCtx.beginPath();
        imgCtx.arc(
          img.naturalWidth / 2, // Center X
          img.naturalHeight / 2, // Center Y
          Math.min(img.naturalWidth / 2, img.naturalHeight / 2), // Radius
          0,
          Math.PI * 2
        );
        imgCtx.closePath();
        imgCtx.clip();

        // Draw the image within the clipped circle
        imgCtx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight); // Maintain full resolution

        // Convert the circular image with the white background to JPEG
        const circularImageData = imgCanvas.toDataURL("image/jpeg", 1);

        // Add the circular image to the PDF at the desired size
        pdf.addImage(
          circularImageData,
          "JPEG",
          17,
          pdfHeight + 10,
          diameter,
          diameter
        ); // Scale the circular image to fit the desired size
      }

      // Add user information with modern design
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Agent Information", 20, pdfHeight + 70); // Start user information further down

      // Add a subtle separator
      pdf.setDrawColor(230, 230, 230);
      pdf.line(20, pdfHeight + 72, 190, pdfHeight + 72);

      // Start adding user information
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");

      // Add the full name
      pdf.text("Full Name", 20, pdfHeight + 80);
      const fullName = `${user.first_name || "N/A"} ${
        user.last_name || ""
      }`.trim();
      pdf.setFont("helvetica", "bold");
      pdf.text(fullName, 60, pdfHeight + 80);

      // Add clickable email with underline
      pdf.setFont("helvetica", "normal");
      pdf.text("Email", 20, pdfHeight + 90);
      pdf.setFont("helvetica", "bold");

      const emailText = String(email || "N/A");

      if (email) {
        // Change text color to blue to indicate it's clickable
        pdf.setTextColor(0, 0, 255); // RGB for blue color

        // Add clickable email link
        pdf.textWithLink(emailText, 60, pdfHeight + 90, {
          url: `mailto:${emailText}`,
        });

        // Add underline
        pdf.line(
          60,
          pdfHeight + 91,
          60 + pdf.getTextWidth(emailText),
          pdfHeight + 91
        ); // Underline the email text

        // Reset text color back to black for the rest of the document
        pdf.setTextColor(0, 0, 0); // RGB for black color
      } else {
        // If email is not available, just add N/A
        pdf.text("N/A", 60, pdfHeight + 90);
      }

      // Add phone number
      pdf.setFont("helvetica", "normal");
      pdf.text("Phone", 20, pdfHeight + 100);
      pdf.setFont("helvetica", "bold");
      pdf.text(String(user.phone || "N/A"), 60, pdfHeight + 100);

      // Add clickable WhatsApp number with underline
      pdf.setFont("helvetica", "normal");
      pdf.text("WhatsApp", 20, pdfHeight + 110);
      pdf.setFont("helvetica", "bold");

      // Construct the WhatsApp URL
      const whatsappNumber = String(user.whatsapp || "N/A");
      const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`; // Format the number correctly

      if (user.whatsapp) {
        // Change text color to blue to indicate it's clickable
        pdf.setTextColor(0, 0, 255); // RGB for blue color

        // Add clickable WhatsApp link
        pdf.textWithLink(whatsappNumber, 60, pdfHeight + 110, {
          url: whatsappLink,
        });

        // Add underline
        pdf.line(
          60,
          pdfHeight + 111,
          60 + pdf.getTextWidth(whatsappNumber),
          pdfHeight + 111
        ); // Underline the WhatsApp text

        // Reset text color back to black for the rest of the document
        pdf.setTextColor(0, 0, 0); // RGB for black color
      } else {
        // If WhatsApp number is not available, just add N/A
        pdf.text("N/A", 60, pdfHeight + 110);
      }

      // Add footer or company info if needed
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(10);
      pdf.text(
        "Generated on: " + new Date().toLocaleDateString(),
        20,
        pdfHeight + 140
      );

      // Save the PDF
      pdf.save("user_profile.pdf");
    } catch (error) {
      console.error(error);
      pdf.save("user_profile.pdf");
    }
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-primary text-white py-2 px-4 shadow-1 rounded-lg hover:bg-secondary transition"
    >
      {loadingAdd ? "Processing..." : "Generate PDF"}
    </button>
  );
};

export default GeneratePDFComponent;
