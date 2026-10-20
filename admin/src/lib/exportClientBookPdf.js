import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Generates and downloads a luxury, print-ready PDF of the Digital Client Book.
 *
 * @param {Array} clients - Array of client records
 */
export function exportClientBookToPdf(clients = []) {
  if (!clients || clients.length === 0) {
    alert('No client records to export.')
    return
  }

  // A4 Landscape: 297mm wide x 210mm high
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const marginLeft = 14
  const marginRight = 14
  const printableWidth = pageWidth - marginLeft - marginRight

  // ── Color Palette ─────────────────────────────────────────────────────────
  const GOLD = [184, 147, 90]        // #b8935a
  const DARK = [20, 19, 16]          // #141310
  const MUTED = [92, 88, 79]         // #5c584f
  const LIGHT_BG = [247, 246, 243]   // #f7f6f3
  const BORDER = [225, 221, 214]     // #e1ddd6

  // ── Header Section ────────────────────────────────────────────────────────
  // Atelier Eyebrow
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2])
  doc.text('LOOKING ELEGANT ATELIER  •  EXCLUSIVE SUIT & SHOE RENTAL', marginLeft, 16)

  // Document Title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(DARK[0], DARK[1], DARK[2])
  doc.text('DIGITAL CLIENT BOOK', marginLeft, 24)

  // Subtitle / Date
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2])
  const formattedDate = new Date().toLocaleDateString('en-RW', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = new Date().toLocaleTimeString('en-RW', { hour: '2-digit', minute: '2-digit' })
  doc.text(`Official Boutique Register  •  Exported on ${formattedDate} at ${formattedTime}`, marginLeft, 29)

  // Gold Divider Line
  doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2])
  doc.setLineWidth(0.7)
  doc.line(marginLeft, 32, pageWidth - marginRight, 32)

  // ── Summary KPI Badges ───────────────────────────────────────────────────
  const total = clients.length
  const activeRentals = clients.filter(c => c.status === 'active_rental').length
  const overdueRentals = clients.filter(c => c.status === 'overdue').length
  const returnedRentals = clients.filter(c => c.status === 'returned').length

  const stats = [
    { label: 'TOTAL CLIENTS', value: String(total), color: DARK },
    { label: 'ACTIVE RENTALS', value: String(activeRentals), color: [29, 78, 216] }, // blue
    { label: 'OVERDUE', value: String(overdueRentals), color: [180, 83, 9] },       // amber
    { label: 'RETURNED', value: String(returnedRentals), color: [5, 150, 105] },     // green
  ]

  const boxWidth = 38
  const boxHeight = 11
  const startY = 35

  stats.forEach((stat, idx) => {
    const x = marginLeft + idx * (boxWidth + 4)
    // Box background
    doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2])
    doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2])
    doc.setLineWidth(0.2)
    doc.roundedRect(x, startY, boxWidth, boxHeight, 1.5, 1.5, 'FD')

    // Label
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6.5)
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2])
    doc.text(stat.label, x + 3, startY + 4)

    // Value
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.setTextColor(stat.color[0], stat.color[1], stat.color[2])
    doc.text(stat.value, x + 3, startY + 9)
  })

  // ── Table Data Formatting ────────────────────────────────────────────────
  const tableData = clients.map((c, index) => {
    const rawDate = c.recorded_at || c.created_at
    const logged = rawDate ? new Date(rawDate).toLocaleDateString('en-GB') : '—'
    const statusLabel =
      c.status === 'active_rental'
        ? 'Active Rental'
        : c.status === 'overdue'
        ? 'Overdue'
        : c.status === 'returned'
        ? 'Returned'
        : (c.status || 'Active')

    return [
      String(index + 1),
      c.full_name || '—',
      c.phone_number || '—',
      c.id_number || '—',
      c.items_taken || '—',
      c.return_due ? new Date(c.return_due).toLocaleDateString('en-GB') : '—',
      statusLabel,
      logged,
    ]
  })

  // ── AutoTable Generation ─────────────────────────────────────────────────
  autoTable(doc, {
    startY: 49,
    margin: { left: marginLeft, right: marginRight, bottom: 16 },
    head: [[
      '#',
      'Client Name',
      'Telephone',
      'National ID / Passport',
      'Outfits / Garments Taken',
      'Return Due',
      'Status',
      'Logged',
    ]],
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: DARK,
      textColor: [255, 255, 255],
      font: 'helvetica',
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 3.2,
      halign: 'left',
    },
    bodyStyles: {
      font: 'helvetica',
      fontSize: 8,
      textColor: DARK,
      cellPadding: 2.8,
      lineColor: BORDER,
      lineWidth: 0.15,
    },
    alternateRowStyles: {
      fillColor: [250, 249, 246], // subtle warm luxury alternating tint
    },
    columnStyles: {
      0: { cellWidth: 9, halign: 'center', fontStyle: 'bold', textColor: GOLD },
      1: { cellWidth: 46, fontStyle: 'bold' },
      2: { cellWidth: 32, font: 'courier' },
      3: { cellWidth: 38, font: 'courier' },
      4: { cellWidth: 72 },
      5: { cellWidth: 26, font: 'courier' },
      6: { cellWidth: 26, halign: 'center', fontStyle: 'bold' },
      7: { cellWidth: 20, font: 'courier', textColor: MUTED },
    },
    didParseCell: (data) => {
      // Custom styling for Status column
      if (data.section === 'body' && data.column.index === 6) {
        const text = String(data.cell.raw || '')
        if (text.includes('Active')) {
          data.cell.styles.textColor = [29, 78, 216]
          data.cell.styles.fillColor = [239, 246, 255]
        } else if (text.includes('Overdue')) {
          data.cell.styles.textColor = [180, 83, 9]
          data.cell.styles.fillColor = [254, 243, 199]
        } else if (text.includes('Returned')) {
          data.cell.styles.textColor = [5, 150, 105]
          data.cell.styles.fillColor = [236, 253, 245]
        }
      }
    },
    didDrawPage: (data) => {
      // Footer on every page
      const pageNum = doc.internal.getNumberOfPages()
      doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2])
      doc.setLineWidth(0.3)
      doc.line(marginLeft, pageHeight - 11, pageWidth - marginRight, pageHeight - 11)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(MUTED[0], MUTED[1], MUTED[2])
      doc.text(
        'Looking Elegant Atelier  •  Suits & Shoes Rental  •  Confidential Boutique Client Register',
        marginLeft,
        pageHeight - 6
      )

      const pageStr = `Page ${data.pageNumber}`
      doc.text(pageStr, pageWidth - marginRight - doc.getTextWidth(pageStr), pageHeight - 6)
    },
  })

  // ── Download File ─────────────────────────────────────────────────────────
  const filename = `looking_elegant_digital_book_${new Date().toISOString().slice(0, 10)}.pdf`
  doc.save(filename)
}
