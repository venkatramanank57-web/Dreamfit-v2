// import React, { forwardRef, useImperativeHandle, useRef } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import logo from "../assets/logo.png";

// const GarmentPDF = forwardRef(({ garment, order }, ref) => {
//   const pdfRef = useRef();

//   useImperativeHandle(ref, () => ({
//     handleDownload: async () => {
//       try {
//         const element = pdfRef.current;
//         if (!element) {
//           console.error("PDF element not found");
//           return;
//         }

//         // Processing message
//         console.log("Generating PDF for:", garment?.garmentId);

//         const canvas = await html2canvas(element, {
//           scale: 2, // 2 is enough for high quality without crashing browser memory
//           useCORS: true,
//           backgroundColor: "#ffffff",
//           logging: false,
//           allowTaint: false,
//           onclone: (clonedDoc) => {
//             // Ensure the cloned element is visible for capture
//             clonedDoc.getElementById("pdf-content").style.display = "block";
//           }
//         });

//         const imgData = canvas.toDataURL("image/jpeg", 0.9); // JPEG is smaller than PNG
//         const pdf = new jsPDF("p", "mm", "a4");

//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pdfHeight = pdf.internal.pageSize.getHeight();

//         const imgWidth = pdfWidth;
//         const imgHeight = (canvas.height * imgWidth) / canvas.width;

//         let heightLeft = imgHeight;
//         let position = 0;

//         // Page 1
//         pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
//         heightLeft -= pdfHeight;

//         // Additional Pages if content is long
//         while (heightLeft > 0) {
//           position = heightLeft - imgHeight;
//           pdf.addPage();
//           pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
//           heightLeft -= pdfHeight;
//         }

//         pdf.save(`Garment_${garment?.garmentId || "Details"}.pdf`);
//       } catch (error) {
//         console.error("PDF Generation Error:", error);
//         alert("Failed to generate PDF. Please try again.");
//       }
//     }
//   }));

//   if (!garment) return null;

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-GB", {
//       day: "numeric",
//       month: "long",
//       year: "numeric"
//     });
//   };

//   const getCategoryName = () => {
//     if (garment?.category && typeof garment.category === 'object') {
//       return garment.category.name || garment.category.categoryName || "N/A";
//     }
//     return garment?.categoryName || "N/A";
//   };

//   const getItemName = () => {
//     if (garment?.item && typeof garment.item === 'object') {
//       return garment.item.name || garment.item.itemName || "N/A";
//     }
//     return garment?.itemName || "N/A";
//   };

//   const tailoringMin = Number(garment?.priceRange?.min) || 0;
//   const tailoringMax = Number(garment?.priceRange?.max) || 0;
//   const fabricPrice = Number(garment?.fabricPrice) || 0;
//   const totalPriceMin = tailoringMin + fabricPrice;
//   const totalPriceMax = tailoringMax + fabricPrice;

//   return (
//     <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
//       <div
//         id="pdf-content"
//         ref={pdfRef}
//         style={{
//           width: "210mm",
//           backgroundColor: "#ffffff",
//           fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
//           padding: "20mm",
//           boxSizing: "border-box",
//           color: "#1e293b"
//         }}
//       >
//         {/* --- Header Section --- */}
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "3px solid #be185d", paddingBottom: "15px", marginBottom: "20px" }}>
//           <img src={logo} alt="Logo" style={{ height: "60px", objectFit: "contain" }} />
//           <div style={{ textAlign: "right" }}>
//             <h1 style={{ color: "#be185d", fontSize: "28px", margin: 0, fontWeight: "900", letterSpacing: "-0.5px" }}>GARMENT CARD</h1>
//             <p style={{ margin: 0, fontSize: "12px", color: "#64748b", fontWeight: "600" }}>ID: {garment?.garmentId || "NEW"}</p>
//           </div>
//         </div>

//         {/* --- Summary Grid --- */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
//           {/* Order Box */}
//           <div style={{ backgroundColor: "#fff1f2", padding: "15px", borderRadius: "10px", border: "1px solid #fecdd3" }}>
//             <h3 style={{ fontSize: "14px", color: "#be185d", margin: "0 0 10px 0", textTransform: "uppercase", letterSpacing: "1px" }}>Order Info</h3>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Order ID:</b> {order?.orderId || "N/A"}</p>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Order Date:</b> {formatDate(order?.orderDate)}</p>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Delivery:</b> <span style={{ color: "#e11d48", fontWeight: "700" }}>{formatDate(garment?.estimatedDelivery)}</span></p>
//           </div>

//           {/* Garment Box */}
//           <div style={{ backgroundColor: "#f8fafc", padding: "15px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
//             <h3 style={{ fontSize: "14px", color: "#475569", margin: "0 0 10px 0", textTransform: "uppercase", letterSpacing: "1px" }}>Details</h3>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Name:</b> {garment?.name || "N/A"}</p>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Category:</b> {getCategoryName()}</p>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Item:</b> {getItemName()}</p>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Priority:</b> <span style={{ color: garment?.priority === 'urgent' ? '#ef4444' : '#0f172a', fontWeight: 'bold' }}>{garment?.priority || "Normal"}</span></p>
//           </div>
//         </div>

//         {/* --- Measurements Section --- */}
//         <div style={{ marginBottom: "30px" }}>
//           <h2 style={{ fontSize: "18px", color: "#0f172a", borderLeft: "5px solid #be185d", paddingLeft: "12px", marginBottom: "15px", fontWeight: "800" }}>MEASUREMENTS</h2>
//           {garment?.measurements?.length > 0 ? (
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
//               {garment.measurements.map((m, idx) => (
//                 <div key={idx} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#fdfdfd" }}>
//                   <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "bold", textTransform: "uppercase", display: "block" }}>{m.name}</span>
//                   <span style={{ fontSize: "16px", fontWeight: "700", color: "#be185d" }}>{m.value} <small style={{ fontSize: "10px", color: "#94a3b8" }}>{m.unit || "in"}</small></span>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1", color: "#94a3b8" }}>No measurements recorded</div>
//           )}
//         </div>

//         {/* --- Notes Section --- */}
//         {garment?.additionalInfo && (
//           <div style={{ marginBottom: "30px" }}>
//             <h2 style={{ fontSize: "18px", color: "#0f172a", borderLeft: "5px solid #be185d", paddingLeft: "12px", marginBottom: "10px", fontWeight: "800" }}>SPECIAL INSTRUCTIONS</h2>
//             <div style={{ padding: "15px", backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", color: "#92400e", fontSize: "14px", lineHeight: "1.6" }}>
//               {garment.additionalInfo}
//             </div>
//           </div>
//         )}

//         {/* --- Images Section --- */}
//         <div style={{ marginBottom: "20px" }}>
//           <h2 style={{ fontSize: "18px", color: "#0f172a", borderLeft: "5px solid #be185d", paddingLeft: "12px", marginBottom: "15px", fontWeight: "800" }}>REFERENCE & CLOTH IMAGES</h2>

//           <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15mm" }}>
//             {/* Combine first few images of each type */}
//             {[...(garment.referenceImages || []), ...(garment.customerImages || []), ...(garment.customerClothImages || [])].slice(0, 4).map((img, idx) => (
//               <div key={idx} style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", backgroundColor: "#f8fafc" }}>
//                 <img
//                   src={img.url}
//                   alt="Garment"
//                   style={{ width: "100%", height: "180px", objectFit: "cover" }}
//                   crossOrigin="anonymous"
//                 />
//                 <div style={{ padding: "8px", fontSize: "10px", textAlign: "center", color: "#94a3b8", fontWeight: "bold" }}>IMAGE {idx + 1}</div>
//               </div>
//             ))}
//           </div>

//           {(!garment.referenceImages?.length && !garment.customerImages?.length && !garment.customerClothImages?.length) && (
//             <p style={{ textAlign: "center", color: "#cbd5e1", fontStyle: "italic" }}>No images attached to this garment.</p>
//           )}
//         </div>

//         {/* --- Footer --- */}
//         <div style={{ marginTop: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "15px", textAlign: "center" }}>
//           <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", fontWeight: "bold" }}>DREAMFIT COUTURE tailors management system</p>
//           <p style={{ margin: "5px 0 0 0", fontSize: "10px", color: "#cbd5e1" }}>Printed on: {new Date().toLocaleString()}</p>
//         </div>
//       </div>
//     </div>
//   );
// });

// export default GarmentPDF;

// import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import logo from "../assets/logo.png";

// const GarmentPDF = forwardRef(({ garment, order }, ref) => {
//   const pdfRef = useRef();
//   const [imagesLoaded, setImagesLoaded] = useState(false);
//   const [imageLoadErrors, setImageLoadErrors] = useState([]);

//   // Function to wait for all images to load
//   const waitForImages = () => {
//     return new Promise((resolve) => {
//       const images = pdfRef.current?.querySelectorAll('img');
//       if (!images || images.length === 0) {
//         resolve();
//         return;
//       }

//       let loadedCount = 0;
//       const totalImages = images.length;

//       const checkAllLoaded = () => {
//         if (loadedCount === totalImages) {
//           console.log('✅ All images loaded');
//           resolve();
//         }
//       };

//       images.forEach(img => {
//         if (img.complete) {
//           loadedCount++;
//           checkAllLoaded();
//         } else {
//           img.addEventListener('load', () => {
//             loadedCount++;
//             checkAllLoaded();
//           });
//           img.addEventListener('error', () => {
//             console.warn('⚠️ Image failed to load:', img.src);
//             loadedCount++;
//             checkAllLoaded();
//           });
//         }
//       });

//       // Timeout fallback
//       setTimeout(() => {
//         console.log('⏰ Timeout: Proceeding with PDF generation');
//         resolve();
//       }, 5000);
//     });
//   };

//   useImperativeHandle(ref, () => ({
//     handleDownload: async () => {
//       try {
//         const element = pdfRef.current;
//         if (!element) {
//           console.error("PDF element not found");
//           return;
//         }

//         console.log("📄 Generating PDF for:", garment?.garmentId);
//         console.log("📸 Images to capture:", {
//           reference: garment?.referenceImages?.length || 0,
//           customer: garment?.customerImages?.length || 0,
//           cloth: garment?.customerClothImages?.length || 0
//         });

//         // Wait for images to load
//         await waitForImages();

//         // Small delay to ensure everything is rendered
//         await new Promise(resolve => setTimeout(resolve, 500));

//         const canvas = await html2canvas(element, {
//           scale: 2.5,
//           useCORS: true,
//           backgroundColor: "#ffffff",
//           logging: false,
//           allowTaint: false,
//           onclone: (clonedDoc, element) => {
//             // Fix any relative paths in cloned document
//             const clonedImages = clonedDoc.querySelectorAll('img');
//             clonedImages.forEach(img => {
//               if (img.src && img.src.startsWith('/')) {
//                 img.src = window.location.origin + img.src;
//               }
//             });
//           }
//         });

//         const imgData = canvas.toDataURL("image/png", 1.0);
//         const pdf = new jsPDF("p", "mm", "a4");

//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pdfHeight = pdf.internal.pageSize.getHeight();

//         const imgWidth = pdfWidth;
//         const imgHeight = (canvas.height * imgWidth) / canvas.width;

//         let heightLeft = imgHeight;
//         let position = 0;
//         let pageCount = 1;

//         // First page
//         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//         heightLeft -= pdfHeight;

//         // Additional pages if needed
//         while (heightLeft > 0) {
//           position = heightLeft - imgHeight;
//           pdf.addPage();
//           pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//           heightLeft -= pdfHeight;
//           pageCount++;
//         }

//         console.log(`✅ PDF generated with ${pageCount} page(s)`);
//         pdf.save(`Garment_${garment?.garmentId || "Details"}.pdf`);

//       } catch (error) {
//         console.error("❌ PDF Generation Error:", error);
//         alert("Failed to generate PDF. Please try again.");
//       }
//     }
//   }));

//   if (!garment) return null;

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-GB", {
//       day: "numeric",
//       month: "long",
//       year: "numeric"
//     });
//   };

//   const getCategoryName = () => {
//     if (garment?.category && typeof garment.category === 'object') {
//       return garment.category.name || garment.category.categoryName || "N/A";
//     }
//     return garment?.categoryName || "N/A";
//   };

//   const getItemName = () => {
//     if (garment?.item && typeof garment.item === 'object') {
//       return garment.item.name || garment.item.itemName || "N/A";
//     }
//     return garment?.itemName || "N/A";
//   };

//   const tailoringMin = Number(garment?.priceRange?.min) || 0;
//   const tailoringMax = Number(garment?.priceRange?.max) || 0;
//   const fabricPrice = Number(garment?.fabricPrice) || 0;
//   const totalPriceMin = tailoringMin + fabricPrice;
//   const totalPriceMax = tailoringMax + fabricPrice;

//   // Get all images with proper URLs
//   const allImages = [
//     ...(garment?.referenceImages || []).map(img => ({ ...img, type: 'reference' })),
//     ...(garment?.customerImages || []).map(img => ({ ...img, type: 'customer' })),
//     ...(garment?.customerClothImages || []).map(img => ({ ...img, type: 'cloth' }))
//   ];

//   // Add image load logging
//   const handleImageLoad = (type, index) => {
//     console.log(`✅ Image loaded: ${type} ${index + 1}`);
//   };

//   const handleImageError = (type, index, url) => {
//     console.error(`❌ Image failed: ${type} ${index + 1} - URL: ${url}`);
//     setImageLoadErrors(prev => [...prev, `${type} ${index + 1}`]);
//   };

//   return (
//     <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
//       <div
//         id="pdf-content"
//         ref={pdfRef}
//         style={{
//           width: "210mm",
//           backgroundColor: "#ffffff",
//           fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
//           padding: "20mm",
//           boxSizing: "border-box",
//           color: "#1e293b"
//         }}
//       >
//         {/* --- Header Section --- */}
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "3px solid #be185d", paddingBottom: "15px", marginBottom: "20px" }}>
//           <img
//             src={logo}
//             alt="Logo"
//             style={{ height: "60px", objectFit: "contain" }}
//             crossOrigin="anonymous"
//             onLoad={() => console.log('✅ Logo loaded')}
//             onError={(e) => console.error('❌ Logo failed to load:', e)}
//           />
//           <div style={{ textAlign: "right" }}>
//             <h1 style={{ color: "#be185d", fontSize: "28px", margin: 0, fontWeight: "900", letterSpacing: "-0.5px" }}>GARMENT CARD</h1>
//             <p style={{ margin: 0, fontSize: "12px", color: "#64748b", fontWeight: "600" }}>ID: {garment?.garmentId || "NEW"}</p>
//           </div>
//         </div>

//         {/* --- Summary Grid --- */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
//           {/* Order Box */}
//           <div style={{ backgroundColor: "#fff1f2", padding: "15px", borderRadius: "10px", border: "1px solid #fecdd3" }}>
//             <h3 style={{ fontSize: "14px", color: "#be185d", margin: "0 0 10px 0", textTransform: "uppercase", letterSpacing: "1px" }}>Order Info</h3>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Order ID:</b> {order?.orderId || "N/A"}</p>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Order Date:</b> {formatDate(order?.orderDate)}</p>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Delivery:</b> <span style={{ color: "#e11d48", fontWeight: "700" }}>{formatDate(garment?.estimatedDelivery)}</span></p>
//           </div>

//           {/* Garment Box */}
//           <div style={{ backgroundColor: "#f8fafc", padding: "15px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
//             <h3 style={{ fontSize: "14px", color: "#475569", margin: "0 0 10px 0", textTransform: "uppercase", letterSpacing: "1px" }}>Details</h3>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Name:</b> {garment?.name || "N/A"}</p>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Category:</b> {getCategoryName()}</p>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Item:</b> {getItemName()}</p>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Priority:</b> <span style={{ color: garment?.priority === 'urgent' ? '#ef4444' : '#0f172a', fontWeight: 'bold' }}>{garment?.priority || "Normal"}</span></p>
//           </div>
//         </div>

//         {/* --- Measurements Section --- */}
//         <div style={{ marginBottom: "30px" }}>
//           <h2 style={{ fontSize: "18px", color: "#0f172a", borderLeft: "5px solid #be185d", paddingLeft: "12px", marginBottom: "15px", fontWeight: "800" }}>MEASUREMENTS</h2>
//           {garment?.measurements?.length > 0 ? (
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
//               {garment.measurements.map((m, idx) => (
//                 <div key={idx} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#fdfdfd" }}>
//                   <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "bold", textTransform: "uppercase", display: "block" }}>{m.name}</span>
//                   <span style={{ fontSize: "16px", fontWeight: "700", color: "#be185d" }}>{m.value} <small style={{ fontSize: "10px", color: "#94a3b8" }}>{m.unit || "in"}</small></span>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1", color: "#94a3b8" }}>No measurements recorded</div>
//           )}
//         </div>

//         {/* --- Notes Section --- */}
//         {garment?.additionalInfo && (
//           <div style={{ marginBottom: "30px" }}>
//             <h2 style={{ fontSize: "18px", color: "#0f172a", borderLeft: "5px solid #be185d", paddingLeft: "12px", marginBottom: "10px", fontWeight: "800" }}>SPECIAL INSTRUCTIONS</h2>
//             <div style={{ padding: "15px", backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", color: "#92400e", fontSize: "14px", lineHeight: "1.6" }}>
//               {garment.additionalInfo}
//             </div>
//           </div>
//         )}

//         {/* --- Images Section --- */}
//         <div style={{ marginBottom: "20px" }}>
//           <h2 style={{ fontSize: "18px", color: "#0f172a", borderLeft: "5px solid #be185d", paddingLeft: "12px", marginBottom: "15px", fontWeight: "800" }}>REFERENCE & CLOTH IMAGES</h2>

//           {allImages.length > 0 ? (
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15mm" }}>
//               {allImages.slice(0, 4).map((img, idx) => (
//                 <div key={idx} style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", backgroundColor: "#f8fafc" }}>
//                   <img
//                     src={img.url}
//                     alt={`${img.type} image ${idx + 1}`}
//                     style={{ width: "100%", height: "180px", objectFit: "cover" }}
//                     crossOrigin="anonymous"
//                     onLoad={() => handleImageLoad(img.type, idx)}
//                     onError={(e) => handleImageError(img.type, idx, img.url)}
//                   />
//                   <div style={{ padding: "8px", fontSize: "10px", textAlign: "center", color: "#94a3b8", fontWeight: "bold" }}>
//                     {img.type === 'reference' ? 'Reference' : img.type === 'customer' ? 'Customer' : 'Cloth'} Image {idx + 1}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p style={{ textAlign: "center", color: "#cbd5e1", fontStyle: "italic" }}>No images attached to this garment.</p>
//           )}

//           {allImages.length > 4 && (
//             <p style={{ textAlign: "center", fontSize: "11px", color: "#94a3b8", marginTop: "10px" }}>
//               + {allImages.length - 4} more image(s) available
//             </p>
//           )}
//         </div>

//         {/* --- Footer --- */}
//         <div style={{ marginTop: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "15px", textAlign: "center" }}>
//           <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", fontWeight: "bold" }}>DREAMFIT COUTURE tailors management system</p>
//           <p style={{ margin: "5px 0 0 0", fontSize: "10px", color: "#cbd5e1" }}>Printed on: {new Date().toLocaleString()}</p>
//         </div>
//       </div>
//     </div>
//   );
// });

// export default GarmentPDF;

// import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import logo from "../assets/logo.png";

// const GarmentPDF = forwardRef(({ garment, order }, ref) => {
//   const pdfRef = useRef();
//   const [imagesLoaded, setImagesLoaded] = useState(false);
//   const [imageLoadErrors, setImageLoadErrors] = useState([]);

//   // Helper function to get proxied image URL
//   const getProxiedUrl = (originalUrl) => {
//     if (!originalUrl) return null;
//     // Only proxy external URLs (R2 storage)
//     if (originalUrl.includes('r2.dev') || originalUrl.includes('cloudflare')) {
//       const backendUrl = process.env.NODE_ENV === 'production'
//         ? 'https://your-backend-url.com'
//         : 'http://localhost:5000';
//       return `${backendUrl}/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
//     }
//     return originalUrl;
//   };

//   // Function to wait for all images to load
//   const waitForImages = () => {
//     return new Promise((resolve) => {
//       const images = pdfRef.current?.querySelectorAll('img');
//       if (!images || images.length === 0) {
//         resolve();
//         return;
//       }

//       let loadedCount = 0;
//       const totalImages = images.length;

//       const checkAllLoaded = () => {
//         if (loadedCount === totalImages) {
//           console.log('✅ All images loaded');
//           resolve();
//         }
//       };

//       images.forEach(img => {
//         if (img.complete) {
//           loadedCount++;
//           checkAllLoaded();
//         } else {
//           img.addEventListener('load', () => {
//             loadedCount++;
//             checkAllLoaded();
//           });
//           img.addEventListener('error', () => {
//             console.warn('⚠️ Image failed to load:', img.src);
//             loadedCount++;
//             checkAllLoaded();
//           });
//         }
//       });

//       // Timeout fallback
//       setTimeout(() => {
//         console.log('⏰ Timeout: Proceeding with PDF generation');
//         resolve();
//       }, 5000);
//     });
//   };

//   useImperativeHandle(ref, () => ({
//     handleDownload: async () => {
//       try {
//         const element = pdfRef.current;
//         if (!element) {
//           console.error("PDF element not found");
//           return;
//         }

//         console.log("📄 Generating PDF for:", garment?.garmentId);
//         console.log("📸 Images to capture:", {
//           reference: garment?.referenceImages?.length || 0,
//           customer: garment?.customerImages?.length || 0,
//           cloth: garment?.customerClothImages?.length || 0
//         });

//         // Wait for images to load
//         await waitForImages();

//         // Small delay to ensure everything is rendered
//         await new Promise(resolve => setTimeout(resolve, 500));

//         const canvas = await html2canvas(element, {
//           scale: 2.5,
//           useCORS: true,
//           backgroundColor: "#ffffff",
//           logging: false,
//           allowTaint: false,
//           onclone: (clonedDoc, element) => {
//             // Fix any relative paths in cloned document
//             const clonedImages = clonedDoc.querySelectorAll('img');
//             clonedImages.forEach(img => {
//               if (img.src && img.src.startsWith('/')) {
//                 img.src = window.location.origin + img.src;
//               }
//             });
//           }
//         });

//         const imgData = canvas.toDataURL("image/png", 1.0);
//         const pdf = new jsPDF("p", "mm", "a4");

//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pdfHeight = pdf.internal.pageSize.getHeight();

//         const imgWidth = pdfWidth;
//         const imgHeight = (canvas.height * imgWidth) / canvas.width;

//         let heightLeft = imgHeight;
//         let position = 0;
//         let pageCount = 1;

//         // First page
//         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//         heightLeft -= pdfHeight;

//         // Additional pages if needed
//         while (heightLeft > 0) {
//           position = heightLeft - imgHeight;
//           pdf.addPage();
//           pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//           heightLeft -= pdfHeight;
//           pageCount++;
//         }

//         console.log(`✅ PDF generated with ${pageCount} page(s)`);
//         pdf.save(`Garment_${garment?.garmentId || "Details"}.pdf`);

//       } catch (error) {
//         console.error("❌ PDF Generation Error:", error);
//         alert("Failed to generate PDF. Please try again.");
//       }
//     }
//   }));

//   if (!garment) return null;

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-GB", {
//       day: "numeric",
//       month: "long",
//       year: "numeric"
//     });
//   };

//   const getCategoryName = () => {
//     if (garment?.category && typeof garment.category === 'object') {
//       return garment.category.name || garment.category.categoryName || "N/A";
//     }
//     return garment?.categoryName || "N/A";
//   };

//   const getItemName = () => {
//     if (garment?.item && typeof garment.item === 'object') {
//       return garment.item.name || garment.item.itemName || "N/A";
//     }
//     return garment?.itemName || "N/A";
//   };

//   const tailoringMin = Number(garment?.priceRange?.min) || 0;
//   const tailoringMax = Number(garment?.priceRange?.max) || 0;
//   const fabricPrice = Number(garment?.fabricPrice) || 0;
//   const totalPriceMin = tailoringMin + fabricPrice;
//   const totalPriceMax = tailoringMax + fabricPrice;

//   // Get all images with proper URLs and proxy
//   const allImages = [
//     ...(garment?.referenceImages || []).map(img => ({ ...img, type: 'reference', originalUrl: img.url, url: getProxiedUrl(img.url) })),
//     ...(garment?.customerImages || []).map(img => ({ ...img, type: 'customer', originalUrl: img.url, url: getProxiedUrl(img.url) })),
//     ...(garment?.customerClothImages || []).map(img => ({ ...img, type: 'cloth', originalUrl: img.url, url: getProxiedUrl(img.url) }))
//   ];

//   // Add image load logging
//   const handleImageLoad = (type, index) => {
//     console.log(`✅ Image loaded: ${type} ${index + 1}`);
//   };

//   const handleImageError = (type, index, url) => {
//     console.error(`❌ Image failed: ${type} ${index + 1} - URL: ${url}`);
//     setImageLoadErrors(prev => [...prev, `${type} ${index + 1}`]);
//   };

//   return (
//     <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
//       <div
//         id="pdf-content"
//         ref={pdfRef}
//         style={{
//           width: "210mm",
//           backgroundColor: "#ffffff",
//           fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
//           padding: "20mm",
//           boxSizing: "border-box",
//           color: "#1e293b"
//         }}
//       >
//         {/* --- Header Section --- */}
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "3px solid #be185d", paddingBottom: "15px", marginBottom: "20px" }}>
//           <img
//             src={logo}
//             alt="Logo"
//             style={{ height: "60px", objectFit: "contain" }}
//             crossOrigin="anonymous"
//             onLoad={() => console.log('✅ Logo loaded')}
//             onError={(e) => console.error('❌ Logo failed to load:', e)}
//           />
//           <div style={{ textAlign: "right" }}>
//             <h1 style={{ color: "#be185d", fontSize: "28px", margin: 0, fontWeight: "900", letterSpacing: "-0.5px" }}>GARMENT CARD</h1>
//             <p style={{ margin: 0, fontSize: "12px", color: "#64748b", fontWeight: "600" }}>ID: {garment?.garmentId || "NEW"}</p>
//           </div>
//         </div>

//         {/* --- Summary Grid --- */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
//           {/* Order Box */}
//           <div style={{ backgroundColor: "#fff1f2", padding: "15px", borderRadius: "10px", border: "1px solid #fecdd3" }}>
//             <h3 style={{ fontSize: "14px", color: "#be185d", margin: "0 0 10px 0", textTransform: "uppercase", letterSpacing: "1px" }}>Order Info</h3>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Order ID:</b> {order?.orderId || "N/A"}</p>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Order Date:</b> {formatDate(order?.orderDate)}</p>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Delivery:</b> <span style={{ color: "#e11d48", fontWeight: "700" }}>{formatDate(garment?.estimatedDelivery)}</span></p>
//           </div>

//           {/* Garment Box */}
//           <div style={{ backgroundColor: "#f8fafc", padding: "15px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
//             <h3 style={{ fontSize: "14px", color: "#475569", margin: "0 0 10px 0", textTransform: "uppercase", letterSpacing: "1px" }}>Details</h3>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Name:</b> {garment?.name || "N/A"}</p>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Category:</b> {getCategoryName()}</p>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Item:</b> {getItemName()}</p>
//             <p style={{ margin: "5px 0", fontSize: "14px" }}><b>Priority:</b> <span style={{ color: garment?.priority === 'urgent' ? '#ef4444' : '#0f172a', fontWeight: 'bold' }}>{garment?.priority || "Normal"}</span></p>
//           </div>
//         </div>

//         {/* --- Measurements Section --- */}
//         <div style={{ marginBottom: "30px" }}>
//           <h2 style={{ fontSize: "18px", color: "#0f172a", borderLeft: "5px solid #be185d", paddingLeft: "12px", marginBottom: "15px", fontWeight: "800" }}>MEASUREMENTS</h2>
//           {garment?.measurements?.length > 0 ? (
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
//               {garment.measurements.map((m, idx) => (
//                 <div key={idx} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#fdfdfd" }}>
//                   <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "bold", textTransform: "uppercase", display: "block" }}>{m.name}</span>
//                   <span style={{ fontSize: "16px", fontWeight: "700", color: "#be185d" }}>{m.value} <small style={{ fontSize: "10px", color: "#94a3b8" }}>{m.unit || "in"}</small></span>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1", color: "#94a3b8" }}>No measurements recorded</div>
//           )}
//         </div>

//         {/* --- Notes Section --- */}
//         {garment?.additionalInfo && (
//           <div style={{ marginBottom: "30px" }}>
//             <h2 style={{ fontSize: "18px", color: "#0f172a", borderLeft: "5px solid #be185d", paddingLeft: "12px", marginBottom: "10px", fontWeight: "800" }}>SPECIAL INSTRUCTIONS</h2>
//             <div style={{ padding: "15px", backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", color: "#92400e", fontSize: "14px", lineHeight: "1.6" }}>
//               {garment.additionalInfo}
//             </div>
//           </div>
//         )}

//         {/* --- Images Section --- */}
//         <div style={{ marginBottom: "20px" }}>
//           <h2 style={{ fontSize: "18px", color: "#0f172a", borderLeft: "5px solid #be185d", paddingLeft: "12px", marginBottom: "15px", fontWeight: "800" }}>REFERENCE & CLOTH IMAGES</h2>

//           {allImages.length > 0 ? (
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15mm" }}>
//               {allImages.slice(0, 6).map((img, idx) => (
//                 <div key={idx} style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", backgroundColor: "#f8fafc" }}>
//                   <img
//                     src={img.url}
//                     alt={`${img.type} image ${idx + 1}`}
//                     style={{ width: "100%", height: "180px", objectFit: "cover" }}
//                     crossOrigin="anonymous"
//                     onLoad={() => handleImageLoad(img.type, idx)}
//                     onError={(e) => {
//                       handleImageError(img.type, idx, img.originalUrl);
//                       e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Crect x='2' y='2' width='20' height='20' rx='2.18'%3E%3C/rect%3E%3Cpath d='M8 2v20M16 2v20M2 8h20M2 16h20'%3E%3C/path%3E%3C/svg%3E";
//                     }}
//                   />
//                   <div style={{ padding: "8px", fontSize: "10px", textAlign: "center", color: "#94a3b8", fontWeight: "bold" }}>
//                     {img.type === 'reference' ? 'Reference' : img.type === 'customer' ? 'Customer' : 'Cloth'} Image {idx + 1}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p style={{ textAlign: "center", color: "#cbd5e1", fontStyle: "italic" }}>No images attached to this garment.</p>
//           )}

//           {allImages.length > 6 && (
//             <p style={{ textAlign: "center", fontSize: "11px", color: "#94a3b8", marginTop: "10px" }}>
//               + {allImages.length - 6} more image(s) available
//             </p>
//           )}
//         </div>

//         {/* --- Footer --- */}
//         <div style={{ marginTop: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "15px", textAlign: "center" }}>
//           <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", fontWeight: "bold" }}>DREAMFIT COUTURE tailors management system</p>
//           <p style={{ margin: "5px 0 0 0", fontSize: "10px", color: "#cbd5e1" }}>Printed on: {new Date().toLocaleString()}</p>
//         </div>
//       </div>
//     </div>
//   );
// });

// export default GarmentPDF;

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../assets/logo.png";

const GarmentPDF = forwardRef(({ garment, order }, ref) => {
  const pdfRef = useRef();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState([]);

  // Helper function to get proxied image URL
  const getProxiedUrl = (originalUrl) => {
    if (!originalUrl) return null;
    // Only proxy external URLs (R2 storage)
    if (originalUrl.includes("r2.dev") || originalUrl.includes("cloudflare")) {
      const backendUrl =
        process.env.NODE_ENV === "production"
          ? "https://your-backend-url.com"
          : "http://localhost:5000";
      return `${backendUrl}/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
    }
    return originalUrl;
  };

  // Function to wait for all images to load
  const waitForImages = () => {
    return new Promise((resolve) => {
      const images = pdfRef.current?.querySelectorAll("img");
      if (!images || images.length === 0) {
        resolve();
        return;
      }

      let loadedCount = 0;
      const totalImages = images.length;

      const checkAllLoaded = () => {
        if (loadedCount === totalImages) {
          console.log("✅ All images loaded");
          resolve();
        }
      };

      images.forEach((img) => {
        if (img.complete) {
          loadedCount++;
          checkAllLoaded();
        } else {
          img.addEventListener("load", () => {
            loadedCount++;
            checkAllLoaded();
          });
          img.addEventListener("error", () => {
            console.warn("⚠️ Image failed to load:", img.src);
            loadedCount++;
            checkAllLoaded();
          });
        }
      });

      // Timeout fallback
      setTimeout(() => {
        console.log("⏰ Timeout: Proceeding with PDF generation");
        resolve();
      }, 5000);
    });
  };

  useImperativeHandle(ref, () => ({
    handleDownload: async () => {
      try {
        const element = pdfRef.current;
        if (!element) {
          console.error("PDF element not found");
          return;
        }

        console.log("📄 Generating PDF for:", garment?.garmentId);
        console.log("📸 Images to capture:", {
          reference: garment?.referenceImages?.length || 0,
          customer: garment?.customerImages?.length || 0,
          cloth: garment?.customerClothImages?.length || 0,
        });

        // Wait for images to load
        await waitForImages();

        // Small delay to ensure everything is rendered
        await new Promise((resolve) => setTimeout(resolve, 500));

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Get sections
        const sections = [];

        // Add header and summary together (always page 1)
        const page1Content = document.createElement("div");
        page1Content.style.width = "210mm";
        page1Content.style.padding = "20mm";
        page1Content.style.backgroundColor = "#ffffff";
        page1Content.style.boxSizing = "border-box";

        const header = document.getElementById("pdf-header");
        const summary = document.getElementById("pdf-summary");
        const measurements = document.getElementById("pdf-measurements");
        const notes = document.getElementById("pdf-notes");

        if (header) page1Content.appendChild(header.cloneNode(true));
        if (summary) page1Content.appendChild(summary.cloneNode(true));
        if (measurements)
          page1Content.appendChild(measurements.cloneNode(true));
        if (notes) page1Content.appendChild(notes.cloneNode(true));

        sections.push(page1Content);

        // Add images section - will be on separate page(s)
        const imagesSection = document.getElementById("pdf-images");
        if (imagesSection) {
          const imagesContainer = document.createElement("div");
          imagesContainer.style.width = "210mm";
          imagesContainer.style.padding = "20mm";
          imagesContainer.style.backgroundColor = "#ffffff";
          imagesContainer.style.boxSizing = "border-box";

          // Clone the images section and limit images to 4 per page
          const clonedImages = imagesSection.cloneNode(true);

          // Get all image containers and limit them
          const imageGrid = clonedImages.querySelector(".image-grid");
          if (imageGrid) {
            const allImages = Array.from(imageGrid.children);
            // Keep only first 4 images on first images page
            const imagesToShow = allImages.slice(0, 4);
            imageGrid.innerHTML = "";
            imagesToShow.forEach((img) => imageGrid.appendChild(img));

            // Add footer
            const footer = document.getElementById("pdf-footer");
            if (footer) {
              clonedImages.appendChild(footer.cloneNode(true));
            }
          }

          imagesContainer.appendChild(clonedImages);
          sections.push(imagesContainer);

          // If there are more than 4 images, create a second images page
          const allImagesElements = document.querySelectorAll(
            "#pdf-images .image-grid > div",
          );
          if (allImagesElements.length > 4) {
            const secondImagesContainer = document.createElement("div");
            secondImagesContainer.style.width = "210mm";
            secondImagesContainer.style.padding = "20mm";
            secondImagesContainer.style.backgroundColor = "#ffffff";
            secondImagesContainer.style.boxSizing = "border-box";

            const secondImagesClone = imagesSection.cloneNode(true);
            const secondImageGrid =
              secondImagesClone.querySelector(".image-grid");
            if (secondImageGrid) {
              const remainingImages = Array.from(allImagesElements).slice(4, 8);
              secondImageGrid.innerHTML = "";
              remainingImages.forEach((img) =>
                secondImageGrid.appendChild(img.cloneNode(true)),
              );

              // Add footer
              const footer = document.getElementById("pdf-footer");
              if (footer) {
                secondImagesClone.appendChild(footer.cloneNode(true));
              }
            }

            secondImagesContainer.appendChild(secondImagesClone);
            sections.push(secondImagesContainer);
          }
        } else {
          // If no images, just add footer
          const footerContainer = document.createElement("div");
          footerContainer.style.width = "210mm";
          footerContainer.style.padding = "20mm";
          footerContainer.style.backgroundColor = "#ffffff";
          footerContainer.style.boxSizing = "border-box";

          const footer = document.getElementById("pdf-footer");
          if (footer) footerContainer.appendChild(footer.cloneNode(true));
          sections.push(footerContainer);
        }

        // Render each section as a separate page
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          document.body.appendChild(section);

          const canvas = await html2canvas(section, {
            scale: 2.5,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
            allowTaint: false,
          });

          document.body.removeChild(section);

          const imgData = canvas.toDataURL("image/png", 1.0);
          const imgWidth = pdf.internal.pageSize.getWidth();
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          if (i > 0) {
            pdf.addPage();
          }

          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        }

        console.log(`✅ PDF generated with ${sections.length} page(s)`);
        pdf.save(`Garment_${garment?.garmentId || "Details"}.pdf`);
      } catch (error) {
        console.error("❌ PDF Generation Error:", error);
        alert("Failed to generate PDF. Please try again.");
      }
    },
  }));

  if (!garment) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getCategoryName = () => {
    if (garment?.category && typeof garment.category === "object") {
      return garment.category.name || garment.category.categoryName || "N/A";
    }
    return garment?.categoryName || "N/A";
  };

  const getItemName = () => {
    if (garment?.item && typeof garment.item === "object") {
      return garment.item.name || garment.item.itemName || "N/A";
    }
    return garment?.itemName || "N/A";
  };

  const tailoringMin = Number(garment?.priceRange?.min) || 0;
  const tailoringMax = Number(garment?.priceRange?.max) || 0;
  const fabricPrice = Number(garment?.fabricPrice) || 0;
  const totalPriceMin = tailoringMin + fabricPrice;
  const totalPriceMax = tailoringMax + fabricPrice;

  // Get all images with proper URLs and proxy
  const allImages = [
    ...(garment?.referenceImages || []).map((img) => ({
      ...img,
      type: "reference",
      originalUrl: img.url,
      url: getProxiedUrl(img.url),
    })),
    ...(garment?.customerImages || []).map((img) => ({
      ...img,
      type: "customer",
      originalUrl: img.url,
      url: getProxiedUrl(img.url),
    })),
    ...(garment?.customerClothImages || []).map((img) => ({
      ...img,
      type: "cloth",
      originalUrl: img.url,
      url: getProxiedUrl(img.url),
    })),
  ];

  // Add image load logging
  const handleImageLoad = (type, index) => {
    console.log(`✅ Image loaded: ${type} ${index + 1}`);
  };

  const handleImageError = (type, index, url) => {
    console.error(`❌ Image failed: ${type} ${index + 1} - URL: ${url}`);
    setImageLoadErrors((prev) => [...prev, `${type} ${index + 1}`]);
  };

  // Limit images to show only first 8 (2 pages of 4 images each)
  const displayImages = allImages.slice(0, 8);

  return (
    <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
      <div
        id="pdf-content"
        ref={pdfRef}
        style={{
          width: "210mm",
          backgroundColor: "#ffffff",
          fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
          padding: "20mm",
          boxSizing: "border-box",
          color: "#1e293b",
        }}
      >
        {/* --- Header Section --- */}
        <div id="pdf-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "3px solid #be185d",
              paddingBottom: "15px",
              marginBottom: "20px",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{ height: "60px", objectFit: "contain" }}
              crossOrigin="anonymous"
              onLoad={() => console.log("✅ Logo loaded")}
              onError={(e) => console.error("❌ Logo failed to load:", e)}
            />
            <div style={{ textAlign: "right" }}>
              <h1
                style={{
                  color: "#be185d",
                  fontSize: "28px",
                  margin: 0,
                  fontWeight: "900",
                  letterSpacing: "-0.5px",
                }}
              >
                GARMENT CARD
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "#64748b",
                  fontWeight: "600",
                }}
              >
                ID: {garment?.garmentId || "NEW"}
              </p>
            </div>
          </div>
        </div>

        {/* --- Summary Grid --- */}
        <div id="pdf-summary">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            {/* Order Box */}
            <div
              style={{
                backgroundColor: "#fff1f2",
                padding: "15px",
                borderRadius: "10px",
                border: "1px solid #fecdd3",
              }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  color: "#be185d",
                  margin: "0 0 10px 0",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Order Info
              </h3>
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                <b>Order ID:</b> {order?.orderId || "N/A"}
              </p>
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                <b>Order Date:</b> {formatDate(order?.orderDate)}
              </p>
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                <b>Delivery:</b>{" "}
                <span style={{ color: "#e11d48", fontWeight: "700" }}>
                  {formatDate(garment?.estimatedDelivery)}
                </span>
              </p>
            </div>

            {/* Garment Box */}
            <div
              style={{
                backgroundColor: "#f8fafc",
                padding: "15px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  color: "#475569",
                  margin: "0 0 10px 0",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Details
              </h3>
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                <b>Name:</b> {garment?.name || "N/A"}
              </p>
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                <b>Category:</b> {getCategoryName()}
              </p>
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                <b>Item:</b> {getItemName()}
              </p>
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                <b>Priority:</b>
                <span
                  style={{
                    color:
                      garment?.priority === "high"
                        ? "#ef4444"
                        : garment?.priority === "low"
                          ? "#10b981"
                          : "#f59e0b",
                    fontWeight: "bold",
                  }}
                >
                  {garment?.priority || "Normal"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* --- Measurements Section --- */}
        <div id="pdf-measurements">
          <div style={{ marginBottom: "30px" }}>
            <h2
              style={{
                fontSize: "18px",
                color: "#0f172a",
                borderLeft: "5px solid #be185d",
                paddingLeft: "12px",
                marginBottom: "15px",
                fontWeight: "800",
              }}
            >
              MEASUREMENTS
            </h2>
            {garment?.measurements?.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "10px",
                }}
              >
                {garment.measurements.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "10px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      backgroundColor: "#fdfdfd",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#64748b",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        display: "block",
                      }}
                    >
                      {m.name}
                    </span>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#be185d",
                      }}
                    >
                      {m.value}{" "}
                      <small style={{ fontSize: "10px", color: "#94a3b8" }}>
                        {m.unit || "in"}
                      </small>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px dashed #cbd5e1",
                  color: "#94a3b8",
                }}
              >
                No measurements recorded
              </div>
            )}
          </div>
        </div>

        {/* --- Notes Section --- */}
        {garment?.additionalInfo && (
          <div id="pdf-notes">
            <div style={{ marginBottom: "30px" }}>
              <h2
                style={{
                  fontSize: "18px",
                  color: "#0f172a",
                  borderLeft: "5px solid #be185d",
                  paddingLeft: "12px",
                  marginBottom: "10px",
                  fontWeight: "800",
                }}
              >
                SPECIAL INSTRUCTIONS
              </h2>
              <div
                style={{
                  padding: "15px",
                  backgroundColor: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: "8px",
                  color: "#92400e",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                {garment.additionalInfo}
              </div>
            </div>
          </div>
        )}

        {/* --- Images Section --- */}
        <div id="pdf-images">
          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: "18px",
                color: "#0f172a",
                borderLeft: "5px solid #be185d",
                paddingLeft: "12px",
                marginBottom: "15px",
                fontWeight: "800",
              }}
            >
              REFERENCE & CLOTH IMAGES
            </h2>

            {displayImages.length > 0 ? (
              <div
                className="image-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "15mm",
                }}
              >
                {displayImages.map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      overflow: "hidden",
                      backgroundColor: "#f8fafc",
                    }}
                  >
                    <img
                      src={img.url}
                      alt={`${img.type} image ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                      }}
                      crossOrigin="anonymous"
                      onLoad={() => handleImageLoad(img.type, idx)}
                      onError={(e) => {
                        handleImageError(img.type, idx, img.originalUrl);
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Crect x='2' y='2' width='20' height='20' rx='2.18'%3E%3C/rect%3E%3Cpath d='M8 2v20M16 2v20M2 8h20M2 16h20'%3E%3C/path%3E%3C/svg%3E";
                      }}
                    />
                    <div
                      style={{
                        padding: "8px",
                        fontSize: "10px",
                        textAlign: "center",
                        color: "#94a3b8",
                        fontWeight: "bold",
                      }}
                    >
                      {img.type === "reference"
                        ? "Reference"
                        : img.type === "customer"
                          ? "Customer"
                          : "Cloth"}{" "}
                      Image {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  color: "#cbd5e1",
                  fontStyle: "italic",
                }}
              >
                No images attached to this garment.
              </p>
            )}

            {allImages.length > 8 && (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "11px",
                  color: "#94a3b8",
                  marginTop: "10px",
                }}
              >
                + {allImages.length - 8} more image(s) not shown (limit 8
                images)
              </p>
            )}
          </div>
        </div>

        {/* --- Footer --- */}
        <div id="pdf-footer">
          <div
            style={{
              marginTop: "30px",
              borderTop: "1px solid #e2e8f0",
              paddingTop: "15px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#94a3b8",
                fontWeight: "bold",
              }}
            >
              DREAMFIT COUTURE tailors management system
            </p>
            <p
              style={{
                margin: "5px 0 0 0",
                fontSize: "10px",
                color: "#cbd5e1",
              }}
            >
              Printed on: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default GarmentPDF;
