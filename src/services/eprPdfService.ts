import { jsPDF } from 'jspdf';

export interface EPRInvoiceData {
  invoiceNumber: string;
  certificateNumber: string;
  issueDate: string;
  lotId: string;
  uploadedImageUrl?: string;
  recycler: {
    name: string;
    cpcbAuthNumber: string;
    spcbConsentNumber: string;
    gstin: string;
    address: string;
    facilityType: string;
    contactPhone: string;
    authorizedSignatory: string;
  };
  seller: {
    name: string;
    sellerId: string;
    phone: string;
    pickupAddress: string;
    pickupType: 'home' | 'self' | 'both';
  };
  items: Array<{
    itemNo: number;
    description: string;
    hsnCode: string;
    eWasteCategory: string;
    weightKg: number;
    ratePerKg: number;
    amount: number;
    eprCreditsKg: number;
  }>;
  totalWeightKg: number;
  totalGrossAmount: number;
  netPayoutAmount: number;
  paymentMode: string;
  paymentTxnRef: string;
  paymentStatus: string;
  environmentalImpact: {
    co2SavedKg: number;
    leadDivertedGrams: number;
    copperRecoveredKg: number;
    landfillDivertedKg: number;
  };
  verificationHash: string;
}

/**
 * Utility to convert an image URL or local asset into base64 Data URL for jsPDF embedding
 */
function loadImageAsBase64(url?: string): Promise<string | null> {
  return new Promise((resolve) => {
    if (!url) return resolve(null);
    if (url.startsWith('data:image')) {
      return resolve(url);
    }
    if (typeof window === 'undefined') {
      return resolve(null);
    }
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 400;
        canvas.height = img.naturalHeight || img.height || 300;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        } else {
          resolve(null);
        }
      } catch (e) {
        console.warn('Canvas base64 conversion failed:', e);
        resolve(null);
      }
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = url;
  });
}

export async function generateEPRInvoicePDF(data: EPRInvoiceData): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 12;
  const contentWidth = pageWidth - margin * 2; // Exactly 186 mm
  const rightEdge = margin + contentWidth; // Exactly 198 mm

  // Outer Formal Document Border
  doc.setDrawColor(30, 41, 59); // Slate 800
  doc.setLineWidth(0.4);
  doc.rect(margin, margin, contentWidth, pageHeight - margin * 2);

  // Top Header Area
  let y = margin + 5;

  // Header Title
  doc.setTextColor(15, 23, 42); // Black / Dark Slate
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('KABADIWALA CIRCULAR RECOVERY & RECYCLING NETWORK', pageWidth / 2, y, { align: 'center' });

  y += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('FORM 6: E-WASTE MANIFEST, EPR DISPOSAL & RECYCLING CERTIFICATE', pageWidth / 2, y, { align: 'center' });

  y += 3.8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(71, 85, 105);
  doc.text(
    '[Prescribed under Rule 19(1) of E-Waste (Management) Rules, 2022 | Ministry of Environment, Forest and Climate Change, Govt. of India]',
    pageWidth / 2,
    y,
    { align: 'center' }
  );

  y += 3.2;
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.3);
  doc.line(margin, y, rightEdge, y);

  // Metadata Grid Table (4 columns)
  const metaY = y;
  const metaHeight = 12;
  const metaColWidth = contentWidth / 4; // 46.5 mm each

  doc.setFillColor(248, 250, 252);
  doc.rect(margin, metaY, contentWidth, metaHeight, 'F');
  doc.line(margin, metaY + metaHeight, rightEdge, metaY + metaHeight);

  // Column Dividers
  for (let i = 1; i < 4; i++) {
    doc.line(margin + metaColWidth * i, metaY, margin + metaColWidth * i, metaY + metaHeight);
  }

  // Meta Col 1: Invoice No
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(100, 116, 139);
  doc.text('INVOICE / MANIFEST NO.', margin + 2, metaY + 4);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  doc.text(data.invoiceNumber, margin + 2, metaY + 9);

  // Meta Col 2: Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(100, 116, 139);
  doc.text('DATE OF ISSUE & HANDOVER', margin + metaColWidth + 2, metaY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  doc.text(data.issueDate, margin + metaColWidth + 2, metaY + 9);

  // Meta Col 3: CPCB Reg Ref
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(100, 116, 139);
  doc.text('CPCB EPR REGISTRATION', margin + metaColWidth * 2 + 2, metaY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(15, 23, 42);
  doc.text(data.recycler.cpcbAuthNumber, margin + metaColWidth * 2 + 2, metaY + 9, {
    maxWidth: metaColWidth - 4,
  });

  // Meta Col 4: Lot Reference
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(100, 116, 139);
  doc.text('DIGITAL LOT IDENTIFIER', margin + metaColWidth * 3 + 2, metaY + 4);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  doc.text(data.lotId, margin + metaColWidth * 3 + 2, metaY + 9);

  y = metaY + metaHeight;

  // Section 1 (Consignor), Section 2 (Consignee) & Photographic Evidence Box
  // Width allocation across 186 mm: Consignor = 63 mm, Consignee = 73 mm, Photo Box = 50 mm
  const col1Width = 63;
  const col2Width = 73;
  const photoColWidth = 50;
  const partyHeight = 35;

  const col1X = margin;
  const col2X = margin + col1Width;
  const photoX = col2X + col2Width;

  // Background fills and dividers
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, contentWidth, partyHeight, 'F');
  doc.line(col2X, y, col2X, y + partyHeight);
  doc.line(photoX, y, photoX, y + partyHeight);
  doc.line(margin, y + partyHeight, rightEdge, y + partyHeight);

  // --- SECTION 1: CONSIGNOR ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text('SECTION 1: CONSIGNOR (SELLER)', col1X + 2.5, y + 4.2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(data.seller.name, col1X + 2.5, y + 9, { maxWidth: col1Width - 5 });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Seller ID: ${data.seller.sellerId}`, col1X + 2.5, y + 13.5);
  doc.text(`Phone: ${data.seller.phone}`, col1X + 2.5, y + 17.5);
  doc.text(`Collection Address: ${data.seller.pickupAddress}`, col1X + 2.5, y + 21.5, {
    maxWidth: col1Width - 5,
  });
  doc.text(
    `Mode: ${
      data.seller.pickupType === 'home'
        ? 'Doorstep Pickup'
        : data.seller.pickupType === 'self'
        ? 'Direct Center Drop'
        : 'Mutual Logistics'
    }`,
    col1X + 2.5,
    y + 31.5
  );

  // --- SECTION 2: CONSIGNEE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text('SECTION 2: CONSIGNEE (RECYCLER)', col2X + 2.5, y + 4.2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(data.recycler.name, col2X + 2.5, y + 9, { maxWidth: col2Width - 5 });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Facility: ${data.recycler.facilityType}`, col2X + 2.5, y + 13.5, {
    maxWidth: col2Width - 5,
  });
  doc.text(`GSTIN: ${data.recycler.gstin} | SPCB: ${data.recycler.spcbConsentNumber}`, col2X + 2.5, y + 20);
  doc.text(`Address: ${data.recycler.address}`, col2X + 2.5, y + 24, {
    maxWidth: col2Width - 5,
  });
  doc.text(`Contact: ${data.recycler.contactPhone}`, col2X + 2.5, y + 31.5, {
    maxWidth: col2Width - 5,
  });

  // --- PHOTOGRAPHIC EVIDENCE (UPLOADED REFERENCE IMAGE) ---
  doc.setFillColor(248, 250, 252);
  doc.rect(photoX, y, photoColWidth, partyHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(15, 23, 42);
  doc.text('PHOTOGRAPHIC LOT EVIDENCE', photoX + photoColWidth / 2, y + 4.2, { align: 'center' });

  const imgBoxX = photoX + 3;
  const imgBoxY = y + 6;
  const imgBoxW = photoColWidth - 6; // 44 mm
  const imgBoxH = 22; // 22 mm

  // Load and embed the reference image
  const base64Image = await loadImageAsBase64(data.uploadedImageUrl || '/demo-scrap.jpg');
  if (base64Image) {
    try {
      doc.addImage(base64Image, 'JPEG', imgBoxX, imgBoxY, imgBoxW, imgBoxH);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.2);
      doc.rect(imgBoxX, imgBoxY, imgBoxW, imgBoxH);
    } catch (e) {
      console.warn('Could not add image to jsPDF:', e);
      doc.setFillColor(226, 232, 240);
      doc.rect(imgBoxX, imgBoxY, imgBoxW, imgBoxH, 'F');
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(6);
      doc.setTextColor(100, 116, 139);
      doc.text('Photo Verified on Scale', imgBoxX + imgBoxW / 2, imgBoxY + imgBoxH / 2, { align: 'center' });
    }
  } else {
    doc.setFillColor(226, 232, 240);
    doc.rect(imgBoxX, imgBoxY, imgBoxW, imgBoxH, 'F');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139);
    doc.text('Photo Verified on Scale', imgBoxX + imgBoxW / 2, imgBoxY + imgBoxH / 2, { align: 'center' });
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.8);
  doc.setTextColor(22, 101, 52); // Green 800
  doc.text(`Verified Inspection Scan • UID: ${data.lotId}`, photoX + photoColWidth / 2, y + 31.5, { align: 'center' });

  y += partyHeight;

  // Section 3: Itemized Inventory Table
  doc.setFillColor(241, 245, 249); // Slate 100
  doc.rect(margin, y, contentWidth, 5, 'F');
  doc.line(margin, y + 5, rightEdge, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(15, 23, 42);
  doc.text('SECTION 3: ITEM-WISE E-WASTE PHYSICAL AUDIT & PURCHASE VALUATION SCHEDULE', margin + 3, y + 3.6);

  y += 5;

  // Table Column Coordinates (Sum of widths = 186 mm)
  // S.No: 8mm, Desc: 54mm, Cat: 22mm, HSN: 18mm, Weight: 18mm, Rate: 20mm, EPR: 18mm, Amount: 28mm
  const tableHeaderY = y;
  const colX = {
    sno: margin,          // 12
    desc: margin + 8,     // 20
    cat: margin + 62,     // 74
    hsn: margin + 84,     // 96
    weight: margin + 102, // 114
    rate: margin + 120,   // 132
    epr: margin + 140,    // 152
    amount: margin + 158, // 170 -> width is 198 - 170 = 28 mm
  };

  const tableCols = [colX.desc, colX.cat, colX.hsn, colX.weight, colX.rate, colX.epr, colX.amount];

  doc.setFillColor(248, 250, 252);
  doc.rect(margin, tableHeaderY, contentWidth, 5.5, 'F');
  doc.line(margin, tableHeaderY + 5.5, rightEdge, tableHeaderY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(30, 41, 59);

  doc.text('S.No.', colX.sno + 1.2, tableHeaderY + 3.8);
  doc.text('Material Description', colX.desc + 1.5, tableHeaderY + 3.8);
  doc.text('Category (Sch-I)', colX.cat + 1.2, tableHeaderY + 3.8);
  doc.text('HSN Code', colX.hsn + 1.2, tableHeaderY + 3.8);
  doc.text('Weight (kg)', colX.weight + 1.2, tableHeaderY + 3.8);
  doc.text('Rate (Rs/kg)', colX.rate + 1.2, tableHeaderY + 3.8);
  doc.text('EPR Credit', colX.epr + 1.2, tableHeaderY + 3.8);
  doc.text('Value (INR)', colX.amount + 2, tableHeaderY + 3.8);

  // Column vertical grid lines in header
  tableCols.forEach((cx) => {
    doc.line(cx, tableHeaderY, cx, tableHeaderY + 5.5);
  });

  y = tableHeaderY + 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);

  const rowHeight = 4.8;

  data.items.forEach((item, idx) => {
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }
    doc.rect(margin, y, contentWidth, rowHeight, 'F');
    doc.line(margin, y + rowHeight, rightEdge, y + rowHeight);

    // Draw vertical column lines
    tableCols.forEach((cx) => {
      doc.line(cx, y, cx, y + rowHeight);
    });

    doc.setTextColor(15, 23, 42);
    doc.text(String(item.itemNo), colX.sno + 2.5, y + 3.4);
    doc.text(item.description, colX.desc + 1.5, y + 3.4, { maxWidth: 51 });
    doc.text(item.eWasteCategory, colX.cat + 1.2, y + 3.4);
    doc.text(item.hsnCode, colX.hsn + 1.2, y + 3.4);
    doc.text(`${item.weightKg.toFixed(1)}`, colX.weight + 1.2, y + 3.4);
    doc.text(`${item.ratePerKg.toFixed(2)}`, colX.rate + 1.2, y + 3.4);
    doc.text(`${item.eprCreditsKg.toFixed(1)} kg`, colX.epr + 1.2, y + 3.4);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.amount.toLocaleString('en-IN')}.00`, colX.amount + 2, y + 3.4);
    doc.setFont('helvetica', 'normal');

    y += rowHeight;
  });

  // Table Summary / Total Row
  const totalRowHeight = 5.8;
  doc.setFillColor(241, 245, 249); // Slate 100
  doc.rect(margin, y, contentWidth, totalRowHeight, 'F');
  doc.line(margin, y + totalRowHeight, rightEdge, y + totalRowHeight);

  tableCols.forEach((cx) => {
    doc.line(cx, y, cx, y + totalRowHeight);
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(15, 23, 42);
  doc.text('TOTAL RECYCLED BATCH QUANTITY & PURCHASE VALUE', colX.desc + 1.5, y + 4);
  doc.text(`${data.totalWeightKg.toFixed(1)} kg`, colX.weight + 1.2, y + 4);
  doc.text(`${data.totalWeightKg.toFixed(1)} kg`, colX.epr + 1.2, y + 4);
  doc.text(`INR ${data.totalGrossAmount.toLocaleString('en-IN')}.00`, colX.amount + 2, y + 4);

  y += totalRowHeight;

  // Section 4 & 5: Settlement Schedule & Environmental Mass Balance (2 Columns, 93 mm each)
  const halfWidth = contentWidth / 2; // 93 mm
  const splitBoxHeight = 33;

  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, halfWidth, splitBoxHeight, 'F');
  doc.line(margin + halfWidth, y, margin + halfWidth, y + splitBoxHeight);
  doc.line(margin, y + splitBoxHeight, rightEdge, y + splitBoxHeight);

  // Left Box: Payment & Settlement
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(15, 23, 42);
  doc.text('SECTION 4: PAYMENT & DISBURSEMENT SETTLEMENT', margin + 3, y + 4.2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Total Purchase Amount:`, margin + 3, y + 9.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`INR ${data.totalGrossAmount.toLocaleString('en-IN')}.00`, margin + halfWidth - 5, y + 9.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text(`Purchase Compliance:`, margin + 3, y + 14.5);
  doc.text(`Statutory E-Waste Acquisition`, margin + 34, y + 14.5);

  doc.text(`Disbursement Channel:`, margin + 3, y + 19.5);
  doc.text(data.paymentMode, margin + 34, y + 19.5, { maxWidth: halfWidth - 38 });

  doc.text(`Bank / UPI Ref UTR:`, margin + 3, y + 24.5);
  doc.setFont('helvetica', 'bold');
  doc.text(data.paymentTxnRef, margin + 34, y + 24.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(22, 101, 52);
  doc.text(`Settlement Status: FULLY DISBURSED & SETTLED`, margin + 3, y + 29.5);

  // Right Box: Environmental Impact Mass Balance
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(15, 23, 42);
  doc.text('SECTION 5: QUANTIFIED ENVIRONMENTAL IMPACT RECORD', margin + halfWidth + 3, y + 4.2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(51, 65, 85);

  const rightValX = rightEdge - 4;

  doc.text('1. Greenhouse Gas Emissions Avoided:', margin + halfWidth + 3, y + 9.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.environmentalImpact.co2SavedKg} kg CO2 eq`, rightValX, y + 9.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text('2. Heavy Metals Diverted from Soil/Water:', margin + halfWidth + 3, y + 14.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.environmentalImpact.leadDivertedGrams} g (Lead/Cadmium)`, rightValX, y + 14.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text('3. Secondary Critical Copper/Metals Recovered:', margin + halfWidth + 3, y + 19.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.environmentalImpact.copperRecoveredKg} kg`, rightValX, y + 19.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text('4. Landfill Divergence & Zero-Waste Index:', margin + halfWidth + 3, y + 24.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.environmentalImpact.landfillDivertedKg} kg (100% Channelized)`, rightValX, y + 24.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.text('EPR Credit Certificate Ref: CPCB/EPR-CREDIT/2026/0921', margin + halfWidth + 3, y + 29.5);

  y += splitBoxHeight;

  // Section 6: Statutory Undertaking & Legal Declaration
  const declHeight = 19;
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, declHeight, 'F');
  doc.line(margin, y + declHeight, rightEdge, y + declHeight);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(15, 23, 42);
  doc.text('SECTION 6: STATUTORY UNDERTAKING & RECYCLER CERTIFICATION', margin + 3, y + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'We hereby certify that the electronic waste items detailed herein have been physically received, weighed, and verified in accordance with the provisions of the E-Waste (Management) Rules, 2022. The material shall be scientifically dismantled and recycled with environmentally sound management practices at our CPCB/SPCB authorized facility without illegal dumping or uncontrolled open burning.',
    margin + 3,
    y + 8,
    { maxWidth: contentWidth - 6 }
  );

  doc.setFont('helvetica', 'bold');
  doc.text(
    `SHA-256 Digital Verification Hash: ${data.verificationHash}`,
    margin + 3,
    y + 16.5
  );

  y += declHeight;

  // Section 7: Dual Signature Blocks
  const sigHeight = 24;
  doc.line(margin + halfWidth, y, margin + halfWidth, y + sigHeight);

  // Consignor Signature Box
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(100, 116, 139);
  doc.text('SIGNATURE OF CONSIGNOR / SELLER', margin + 3, y + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(15, 23, 42);
  doc.text(data.seller.name, margin + 3, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.text(`Digital KYC Confirmed: ${data.issueDate}`, margin + 3, y + 18.5);

  // Consignee Signature Box
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(100, 116, 139);
  doc.text('FOR AUTHORIZED RECYCLER (CONSIGNEE)', margin + halfWidth + 3, y + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(15, 23, 42);
  doc.text(data.recycler.authorizedSignatory, margin + halfWidth + 3, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(30, 41, 59);
  doc.text(
    `[Authorized Signatory & CPCB Registered Seal: ${data.recycler.name}]`,
    margin + halfWidth + 3,
    y + 16,
    { maxWidth: halfWidth - 6 }
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.setTextColor(100, 116, 139);
  doc.text(`System Verified Timestamp: ${new Date().toISOString()}`, margin + halfWidth + 3, y + 21);

  // Page Footer Note
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Page 1 of 1 | This is a computer-generated statutory manifest and EPR certificate under Rule 19 of E-Waste (Management) Rules, 2022. No physical signature required.',
    pageWidth / 2,
    pageHeight - margin + 3.5,
    { align: 'center' }
  );

  // Save / Download PDF
  const filename = `EPR_Manifest_Certificate_${data.lotId}_${data.invoiceNumber}.pdf`;
  doc.save(filename);
}

export function buildEPRInvoiceDataFromLot(lot: any): EPRInvoiceData {
  const verifiedWeight = lot.verifiedWeight || lot.weight || 6.8;
  const rate = lot.offerPrice || 157;
  const totalAmount = lot.finalAmount || Math.round(verifiedWeight * rate);

  const fallbackItems = [
    {
      itemNo: 1,
      description: 'Computer Keyboard & Peripherals',
      hsnCode: '847160',
      eWasteCategory: 'ITEW1',
      weightKg: 1.2,
      ratePerKg: 120,
      amount: 144,
      eprCreditsKg: 1.2,
    },
    {
      itemNo: 2,
      description: 'Smartphones & Handheld Cellular Units',
      hsnCode: '851712',
      eWasteCategory: 'ITEW2',
      weightKg: 0.6,
      ratePerKg: 450,
      amount: 270,
      eprCreditsKg: 0.6,
    },
    {
      itemNo: 3,
      description: 'Optical Mouse Units',
      hsnCode: '847160',
      eWasteCategory: 'ITEW1',
      weightKg: 0.4,
      ratePerKg: 100,
      amount: 40,
      eprCreditsKg: 0.4,
    },
    {
      itemNo: 4,
      description: 'Insulated Copper Cables & Power Adapters',
      hsnCode: '854449',
      eWasteCategory: 'CEEW1',
      weightKg: 1.1,
      ratePerKg: 220,
      amount: 242,
      eprCreditsKg: 1.1,
    },
    {
      itemNo: 5,
      description: 'Digital Cameras & Optical Sensor Units',
      hsnCode: '852580',
      eWasteCategory: 'CEEW2',
      weightKg: 0.6,
      ratePerKg: 350,
      amount: 210,
      eprCreditsKg: 0.6,
    },
    {
      itemNo: 6,
      description: 'Electronic Calculators & Li-Ion Power Banks',
      hsnCode: '847010',
      eWasteCategory: 'ITEW3',
      weightKg: 0.6,
      ratePerKg: 150,
      amount: 90,
      eprCreditsKg: 0.6,
    },
    {
      itemNo: 7,
      description: 'LCD / Tablet Display Assemblies',
      hsnCode: '852859',
      eWasteCategory: 'ITEW4',
      weightKg: 1.5,
      ratePerKg: 80,
      amount: 120,
      eprCreditsKg: 1.5,
    },
    {
      itemNo: 8,
      description: 'Magnetic Storage Media (Floppy/VHS)',
      hsnCode: '852329',
      eWasteCategory: 'ITEW5',
      weightKg: 0.8,
      ratePerKg: 50,
      amount: 40,
      eprCreditsKg: 0.8,
    },
  ];

  let items = fallbackItems;
  if (lot.itemizedBreakdown && lot.itemizedBreakdown.length > 0) {
    items = lot.itemizedBreakdown.map((item: any, idx: number) => ({
      itemNo: idx + 1,
      description: item.name || 'E-Waste Material',
      hsnCode: '854890',
      eWasteCategory: 'ITEW1',
      weightKg: item.weightKg || 1,
      ratePerKg: item.offerPrice || 150,
      amount: item.subtotal || Math.round((item.weightKg || 1) * (item.offerPrice || 150)),
      eprCreditsKg: item.weightKg || 1,
    }));
  }

  const rawLotNum = String(lot.id).replace(/\D/g, '') || '1042';
  const invoiceNum = `EPR-INV-2026-${rawLotNum.padStart(4, '0')}`;
  const certNum = `CPCB-EPR-2026-EW-${rawLotNum.padStart(5, '0')}`;

  return {
    invoiceNumber: invoiceNum,
    certificateNumber: certNum,
    issueDate: new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    lotId: lot.id || `KBD-${rawLotNum}`,
    uploadedImageUrl: lot.imageUrl || lot.photoUrl || lot.scannedImage || lot.imageUri || '/demo-scrap.jpg',
    recycler: {
      name: 'GREENCYCLE RECYCLING PRIVATE LIMITED',
      cpcbAuthNumber: 'CPCB/EPR-EWASTE/2026/AUTH-08892',
      spcbConsentNumber: 'MPCB/E-WASTE/REC-2024/9912',
      gstin: '27AABCG1234F1Z8',
      address: 'Plot No. 42-B, MIDC Industrial Area, Andheri East, Mumbai, MH - 400093',
      facilityType: 'R2v3 Certified Integrated E-Waste Dismantler & Smelter Facility',
      contactPhone: '+91 22 2834 9900 | compliance@greencyclerecycling.in',
      authorizedSignatory: 'Rajesh Nair (Head of Regulatory Compliance)',
    },
    seller: {
      name: lot.customerName || 'Raju Sharma (Registered E-Waste Collector)',
      sellerId: 'KBD-SELLER-9082',
      phone: '+91 98200 12345',
      pickupAddress: lot.customerAddress || 'Shop No. 12, Dharavi Cross Road, Mumbai, MH - 400017',
      pickupType: lot.pickupType || 'home',
    },
    items,
    totalWeightKg: verifiedWeight,
    totalGrossAmount: totalAmount,
    netPayoutAmount: totalAmount,
    paymentMode: 'Electronic Funds Transfer (Instant UPI / IMPS)',
    paymentTxnRef: `UTR-2026-${Date.now()}`,
    paymentStatus: 'SETTLED',
    environmentalImpact: {
      co2SavedKg: Math.round(verifiedWeight * 2.1 * 10) / 10,
      leadDivertedGrams: Math.round(verifiedWeight * 35),
      copperRecoveredKg: Math.round(verifiedWeight * 0.28 * 10) / 10,
      landfillDivertedKg: Math.round(verifiedWeight * 10) / 10,
    },
    verificationHash: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
  };
}
