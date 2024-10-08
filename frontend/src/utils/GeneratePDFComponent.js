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
  region,
  mainRegion,
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

    let pdfHeight = 40; // Starting height for content

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
          1.4;

        // Add house image to the PDF
        pdf.addImage(imgData, "JPEG", 25, 30, pdfWidth, imgHeight);

        pdfHeight = imgHeight + 35; // Adjust height after image
      }

      // Line separator between sections
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, pdfHeight, 190, pdfHeight);

      pdfHeight += 22;

      // Property Information (Left Side)
      pdf.setFontSize(10); // Smaller font size for property info
      pdf.setFont("helvetica", "bold");

      // Type badge
      const typeBadge = `${type}`;
      const saleStatus = "For Sale";

      pdf.setFillColor(1, 174, 230); // Green background for type badge
      pdf.roundedRect(20, pdfHeight + 1, 15, 6, 3, 3, "F");
      pdf.setTextColor(255, 255, 255); // White text for type
      pdf.text(typeBadge, 24, pdfHeight + 5);

      // Sale Status badge
      pdf.setFillColor(0, 90, 140); // Blue background for sale status
      pdf.roundedRect(36, pdfHeight + 1, 22, 6, 3, 3, "F");
      pdf.text(saleStatus, 40, pdfHeight + 5);

      pdfHeight += 18; // Move down after the badges

      // Location, Bedrooms, Area (Left)
      pdf.setTextColor(0, 90, 140); // Reset to black text
      pdf.setFontSize(15); // Smaller font size
      pdf.text(`${location}, ${region}, ${mainRegion}`, 20, pdfHeight);

      pdfHeight += 10;

      // Bedrooms
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10); // Smaller font size
      pdf.text(`- Bedroom(s): ${bedrooms} `, 20, pdfHeight);

      pdfHeight += 10;
      // Built-up Area
      pdf.text(`- Built-up Area: ${area} sqft`, 20, pdfHeight);

      pdfHeight += 10;

      // Plot Area
      pdf.text(
        `- Plot Area: ${plotArea ? plotArea + " sqft" : "N/A"}`,
        20,
        pdfHeight
      );

      pdfHeight += 10;

      // User Information (Right Side)
      const userInfoStartX = 117; // X-position for the user information on the right

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
          userInfoStartX,
          pdfHeight - 65,
          diameter,
          diameter
        ); // Scale the circular image to fit the desired size
      }

      pdfHeight -= 3;
      // Full Name
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Agent Information", userInfoStartX + 5, pdfHeight - 2); // Start user info on the right

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text("Full Name", userInfoStartX, pdfHeight + 8);
      const fullName = `${user.first_name || "N/A"} ${
        user.last_name || ""
      }`.trim();
      pdf.setFont("helvetica", "normal");
      pdf.text(fullName, userInfoStartX + 26, pdfHeight + 8);

      // Email
      pdf.setFont("helvetica", "bold");
      pdf.text("Email", userInfoStartX, pdfHeight + 18);
      pdf.setFont("helvetica", "normal");
      const emailText = String(email || "N/A");

      if (email) {
        pdf.setTextColor(0, 90, 140); // Blue for clickable text
        pdf.textWithLink(emailText, userInfoStartX + 26, pdfHeight + 18, {
          url: `mailto:${emailText}`,
        });
        pdf.line(
          userInfoStartX + 26,
          pdfHeight + 19,
          userInfoStartX + 26 + pdf.getTextWidth(emailText),
          pdfHeight + 19
        ); // Underline
        pdf.setTextColor(0, 0, 0); // Reset text color to black
      } else {
        pdf.text("N/A", userInfoStartX + 26, pdfHeight + 18);
      }

      // Phone Number
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 90, 140);
      pdf.text("Phone", userInfoStartX, pdfHeight + 28);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        String(user.phone || "N/A"),
        userInfoStartX + 26,
        pdfHeight + 28
      );

      // WhatsApp Number
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 90, 140);
      pdf.text("WhatsApp", userInfoStartX, pdfHeight + 38);
      pdf.setFont("helvetica", "normal");

      const whatsappNumber = String(user.whatsapp || "N/A");
      const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;

      if (user.whatsapp) {
        pdf.setTextColor(0, 90, 140); // Blue for clickable text
        pdf.textWithLink(whatsappNumber, userInfoStartX + 26, pdfHeight + 38, {
          url: whatsappLink,
        });
        pdf.line(
          userInfoStartX + 26,
          pdfHeight + 39,
          userInfoStartX + 26 + pdf.getTextWidth(whatsappNumber),
          pdfHeight + 39
        ); // Underline
        pdf.setTextColor(0, 0, 0); // Reset text color to black
      } else {
        pdf.text("N/A", userInfoStartX + 40, pdfHeight + 38);
      }

      const companyprofile =
        "https://drive.google.com/file/d/14ZxLzxWCM21lDYVqM__pHEQXeoYFVX2w/view?usp=sharing";

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 90, 140);
      pdf.textWithLink("Company Profile", userInfoStartX, pdfHeight + 48, {
        url: companyprofile,
      });
      pdf.line(
        userInfoStartX ,
        pdfHeight + 49,
        userInfoStartX + pdf.getTextWidth(whatsappNumber),
        pdfHeight + 49
      ); // Underline
      pdf.setFont("helvetica", "normal");

      /* Footer or additional info if needed
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(10);
      pdf.text(
        "Generated on: " + new Date().toLocaleDateString(),
        20,
        pdfHeight + 70
      ); */

      // Save the PDF
      pdf.save("user_profile.pdf");
    } catch (error) {
      console.error(error);
      pdf.save("user_profile.pdf"); // Save the PDF even in case of an error
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
