import React from "react";
import jsPDF from "jspdf";

const GeneratePDFComponent = ({
  user,
  selectedImage,
  updatedImages,
  imageStandard,
  imageStory,
  email,
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
        pdfHeight = imgHeight + 50; // Add 50px padding below the image
      }

      // Line separator under house image
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, pdfHeight, 190, pdfHeight);

      // User image below the house image
      if (user.image) {
        const img = await loadImage(user.image);
        pdf.addImage(img, "JPEG", 20, pdfHeight + 10, 40, 40); // Adjust image size and position
      }

      // Add user information with modern design
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Agent Information", 20, pdfHeight + 60); // Start user information further down

      // Add a subtle separator
      pdf.setDrawColor(230, 230, 230);
      pdf.line(20, pdfHeight + 62, 190, pdfHeight + 62);

      // Start adding user information
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");

      // Add the full name
      pdf.text("Full Name", 20, pdfHeight + 75);
      const fullName = `${user.first_name || "N/A"} ${
        user.last_name || ""
      }`.trim();
      pdf.setFont("helvetica", "bold");
      pdf.text(fullName, 60, pdfHeight + 75);

      // Add clickable email with underline
      pdf.setFont("helvetica", "normal");
      pdf.text("Email", 20, pdfHeight + 85);
      pdf.setFont("helvetica", "bold");

      const emailText = String(email || "N/A");

      if (email) {
        // Change text color to blue to indicate it's clickable
        pdf.setTextColor(0, 0, 255); // RGB for blue color

        // Add clickable email link
        pdf.textWithLink(emailText, 60, pdfHeight + 85, {
          url: `mailto:${emailText}`,
        });

        // Add underline
        pdf.line(
          60,
          pdfHeight + 86,
          60 + pdf.getTextWidth(emailText),
          pdfHeight + 86
        ); // Underline the email text

        // Reset text color back to black for the rest of the document
        pdf.setTextColor(0, 0, 0); // RGB for black color
      } else {
        // If email is not available, just add N/A
        pdf.text("N/A", 60, pdfHeight + 85);
      }

      // Add phone number
      pdf.setFont("helvetica", "normal");
      pdf.text("Phone", 20, pdfHeight + 95);
      pdf.setFont("helvetica", "bold");
      pdf.text(String(user.phone || "N/A"), 60, pdfHeight + 95);

      // Add clickable WhatsApp number with underline
      pdf.setFont("helvetica", "normal");
      pdf.text("WhatsApp", 20, pdfHeight + 105);
      pdf.setFont("helvetica", "bold");

      // Construct the WhatsApp URL
      const whatsappNumber = String(user.whatsapp || "N/A");
      const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`; // Format the number correctly

      if (user.whatsapp) {
        // Change text color to blue to indicate it's clickable
        pdf.setTextColor(0, 0, 255); // RGB for blue color

        // Add clickable WhatsApp link
        pdf.textWithLink(whatsappNumber, 60, pdfHeight + 105, {
          url: whatsappLink,
        });

        // Add underline
        pdf.line(
          60,
          pdfHeight + 106,
          60 + pdf.getTextWidth(whatsappNumber),
          pdfHeight + 106
        ); // Underline the WhatsApp text

        // Reset text color back to black for the rest of the document
        pdf.setTextColor(0, 0, 0); // RGB for black color
      } else {
        // If WhatsApp number is not available, just add N/A
        pdf.text("N/A", 60, pdfHeight + 105);
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
      className="bg-primary text-white py-2 px-4 shadow-sm rounded-lg hover:bg-secondary transition"
    >
      Generate PDF
    </button>
  );
};

export default GeneratePDFComponent;
