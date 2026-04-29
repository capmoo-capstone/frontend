import type { FinanceExportItem } from '../types';

interface FinancePdfOptions {
  generatedBy?: string;
}

interface PdfImage {
  bytes: Uint8Array;
  width: number;
  height: number;
}

interface ReportColumn {
  key: string;
  label: string[];
  width: number;
  align?: 'left' | 'center' | 'right';
  maxLines?: number;
}

const PAGE_WIDTH = 842;
const PAGE_HEIGHT = 595;
const PAGE_SCALE = 1.6;
const ROWS_PER_PAGE = 10;
const TABLE_X = 36;
const TABLE_Y = 145;
const HEADER_HEIGHT = 36;
const ROW_HEIGHT = 37;

const THAI_MONTHS = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

const THAI_SHORT_MONTHS = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

const REPORT_COLUMNS: ReportColumn[] = [
  { key: 'index', label: ['ลำดับ'], width: 29, align: 'center' },
  { key: 'referenceNo', label: ['เลขที่', 'อ้างอิง'], width: 33, align: 'center' },
  { key: 'sentDate', label: ['วันที่ส่ง', 'การเงิน'], width: 57, align: 'center' },
  { key: 'title', label: ['เรื่อง'], width: 121, maxLines: 2 },
  { key: 'vendorName', label: ['บริษัท'], width: 97, maxLines: 2 },
  { key: 'installment', label: ['งวด', 'งานที่'], width: 37, align: 'center' },
  { key: 'budget', label: ['จำนวนเงิน'], width: 58, align: 'right' },
  { key: 'poNo', label: ['เลขที่', 'PO'], width: 36, align: 'center' },
  { key: 'contractNo', label: ['เลขที่สัญญา'], width: 58, align: 'center' },
  { key: 'departmentName', label: ['หน่วยงาน'], width: 97, maxLines: 2 },
  { key: 'responsiblePerson', label: ['ผู้จัดทำ'], width: 75, maxLines: 2 },
  { key: 'financeReceivedDate', label: ['วันที่การเงินรับ', 'เอกสาร'], width: 72, align: 'center' },
];

const encodeText = (value: string | number) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const getFiscalYear = (date: Date) => date.getFullYear() + (date.getMonth() >= 9 ? 544 : 543);

const formatThaiLongDate = (date: Date) =>
  `${date.getDate()} ${THAI_MONTHS[date.getMonth()]} พ.ศ. ${date.getFullYear() + 543}`;

const formatThaiShortDate = (date: Date) =>
  `${date.getDate()} ${THAI_SHORT_MONTHS[date.getMonth()]} ${date.getFullYear() + 543}`;

const formatThaiDateTime = (date: Date) => {
  const time = date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${formatThaiLongDate(date)} เวลา ${time} น.`;
};

const formatBudget = (budget: number) =>
  budget.toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const chunkItems = (items: FinanceExportItem[]) => {
  const pages: FinanceExportItem[][] = [];
  for (let index = 0; index < items.length; index += ROWS_PER_PAGE) {
    pages.push(items.slice(index, index + ROWS_PER_PAGE));
  }
  return pages.length > 0 ? pages : [[]];
};

const wrapLongWord = (word: string, maxChars: number) => {
  const chunks: string[] = [];
  for (let index = 0; index < word.length; index += maxChars) {
    chunks.push(word.slice(index, index + maxChars));
  }
  return chunks;
};

const wrapText = (value: string | number | null | undefined, maxChars: number, maxLines = 1) => {
  const text = value == null ? '-' : String(value).trim();
  if (!text) return [''];

  const words = text.split(/\s+/).flatMap((word) => wrapLongWord(word, maxChars));
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length <= maxChars) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) lines.push(currentLine);
    currentLine = word;

    if (lines.length === maxLines) break;
  }

  if (currentLine && lines.length < maxLines) lines.push(currentLine);
  if (lines.length === 0) lines.push('-');

  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
    lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, Math.max(maxChars - 1, 1))}…`;
  }

  return lines;
};

const getTextAnchor = (align: ReportColumn['align']) => {
  if (align === 'right') return 'end';
  if (align === 'center') return 'middle';
  return 'start';
};

const getTextX = (columnX: number, width: number, align: ReportColumn['align']) => {
  if (align === 'right') return columnX + width - 4;
  if (align === 'center') return columnX + width / 2;
  return columnX + 5;
};

const renderTextBlock = ({
  align,
  className,
  height,
  lineHeight,
  lines,
  width,
  x,
  y,
}: {
  align?: ReportColumn['align'];
  className: string;
  height: number;
  lineHeight: number;
  lines: string[];
  width: number;
  x: number;
  y: number;
}) => {
  const textX = getTextX(x, width, align);
  const anchor = getTextAnchor(align);
  const firstLineY = y + height / 2 - ((lines.length - 1) * lineHeight) / 2 + 3.5;

  return `<text x="${textX}" y="${firstLineY}" text-anchor="${anchor}" class="${className}">
    ${lines
      .map(
        (line, index) =>
          `<tspan x="${textX}" dy="${index === 0 ? 0 : lineHeight}">${encodeText(line)}</tspan>`
      )
      .join('')}
  </text>`;
};

const getColumnPositions = () => {
  let x = TABLE_X;
  return REPORT_COLUMNS.map((column) => {
    const positionedColumn = { ...column, x };
    x += column.width;
    return positionedColumn;
  });
};

const getRowValue = (
  item: FinanceExportItem,
  key: string,
  absoluteIndex: number,
  sentDate: string
) => {
  switch (key) {
    case 'index':
      return absoluteIndex + 1;
    case 'referenceNo':
      return item.receive_no;
    case 'sentDate':
      return sentDate;
    case 'title':
      return item.project_title;
    case 'vendorName':
      return item.vendor_name;
    case 'installment':
      return item.contract_step ?? '-';
    case 'budget':
      return formatBudget(item.budget);
    case 'poNo':
      return item.po_no;
    case 'contractNo':
      return item.contract_no;
    case 'departmentName':
      return item.department_name;
    case 'responsiblePerson':
      return item.responsible_person;
    case 'financeReceivedDate':
      return '';
    default:
      return '-';
  }
};

const renderReportLogo = () => `
  <g transform="translate(306 66)">
    <ellipse cx="14" cy="12" rx="10" ry="15" fill="#f4c9dc" opacity="0.8" />
    <path d="M14 0 C9 6 8 14 14 29 C20 14 19 6 14 0 Z" fill="#e58ab2" opacity="0.65" />
    <rect x="6" y="29" width="16" height="5" rx="1" fill="#e58ab2" opacity="0.65" />
    <path d="M3 36 H25" stroke="#e58ab2" stroke-width="2" opacity="0.65" />
  </g>
  <text x="338" y="92" class="brand">NexusProcure</text>
`;

const renderHeader = (date: Date, generatedBy?: string) => {
  const reportDate = formatThaiLongDate(date);
  const printedDateTime = formatThaiDateTime(date);
  const printedBy = generatedBy ? `${generatedBy} ผู้พิมพ์รายงาน` : 'ผู้พิมพ์รายงาน';

  return `
    <text x="${TABLE_X}" y="45" class="topMeta">${encodeText(printedBy)}</text>
    <text x="${PAGE_WIDTH - TABLE_X}" y="45" text-anchor="end" class="topMeta">
      พิมพ์จากระบบ NexusProcure เมื่อวันที่ ${encodeText(printedDateTime)}
    </text>
    ${renderReportLogo()}
    <text x="${PAGE_WIDTH / 2}" y="130" text-anchor="middle" class="reportTitle">
      เอกสารส่งเบิกฝ่ายการเงิน ประจำปีงบประมาณ ${getFiscalYear(date)} (งานซื้อ/งานจ้าง) วันที่ ${encodeText(reportDate)}
    </text>
  `;
};

const renderTable = (items: FinanceExportItem[], pageIndex: number, sentDate: string) => {
  const columns = getColumnPositions();
  const tableWidth = REPORT_COLUMNS.reduce((sum, column) => sum + column.width, 0);

  const headerCells = columns
    .map((column) => {
      return `
        <rect x="${column.x}" y="${TABLE_Y}" width="${column.width}" height="${HEADER_HEIGHT}" class="cellBorder" />
        ${renderTextBlock({
          align: 'center',
          className: 'tableHeader',
          height: HEADER_HEIGHT,
          lineHeight: 15,
          lines: column.label,
          width: column.width,
          x: column.x,
          y: TABLE_Y,
        })}
      `;
    })
    .join('');

  const rows = items
    .map((item, rowIndex) => {
      const rowY = TABLE_Y + HEADER_HEIGHT + rowIndex * ROW_HEIGHT;
      const absoluteIndex = pageIndex * ROWS_PER_PAGE + rowIndex;

      const cells = columns
        .map((column) => {
          const maxChars = Math.max(Math.floor(column.width / 5.4), 3);
          const lines = wrapText(
            getRowValue(item, column.key, absoluteIndex, sentDate),
            maxChars,
            column.maxLines ?? 1
          );

          return `
            <rect x="${column.x}" y="${rowY}" width="${column.width}" height="${ROW_HEIGHT}" class="cellBorder" />
            ${renderTextBlock({
              align: column.align,
              className: 'tableCell',
              height: ROW_HEIGHT,
              lineHeight: 13.5,
              lines,
              width: column.width,
              x: column.x,
              y: rowY,
            })}
          `;
        })
        .join('');

      return `<g>${cells}</g>`;
    })
    .join('');

  return `
    <rect x="${TABLE_X}" y="${TABLE_Y}" width="${tableWidth}" height="${HEADER_HEIGHT + items.length * ROW_HEIGHT}" fill="none" class="outerBorder" />
    ${headerCells}
    ${rows}
  `;
};

const renderSvgPage = ({
  date,
  generatedBy,
  items,
  pageIndex,
}: {
  date: Date;
  generatedBy?: string;
  items: FinanceExportItem[];
  pageIndex: number;
}) => {
  const sentDate = formatThaiShortDate(date);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${PAGE_WIDTH}" height="${PAGE_HEIGHT}" viewBox="0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}">
      <style>
        .page { fill: #ffffff; }
        .topMeta { fill: #4b4b4b; font: italic 9.5px 'Noto Sans Thai', Arial, sans-serif; }
        .brand { fill: #d25586; font: 400 34px Arial, sans-serif; }
        .reportTitle { fill: #222222; font: 700 12.5px 'Noto Sans Thai', Arial, sans-serif; }
        .tableHeader { fill: #222222; font: 700 9.8px 'Noto Sans Thai', Arial, sans-serif; }
        .tableCell { fill: #424242; font: 400 9.5px 'Noto Sans Thai', Arial, sans-serif; }
        .cellBorder { fill: #ffffff; stroke: #222222; stroke-width: 0.55; }
        .outerBorder { stroke: #222222; stroke-width: 0.7; }
        .pageNumber { fill: #222222; font: 400 11px Arial, sans-serif; }
      </style>
      <rect width="100%" height="100%" class="page" />
      ${renderHeader(date, generatedBy)}
      ${renderTable(items, pageIndex, sentDate)}
      <text x="${PAGE_WIDTH / 2}" y="572" text-anchor="middle" class="pageNumber">${pageIndex + 1}</text>
    </svg>
  `;
};

const waitForFonts = async () => {
  if ('fonts' in document) {
    await document.fonts.ready;
  }
};

const svgToJpeg = async (svg: string): Promise<PdfImage> => {
  await waitForFonts();

  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Unable to render finance PDF page'));
      img.src = svgUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(PAGE_WIDTH * PAGE_SCALE);
    canvas.height = Math.round(PAGE_HEIGHT * PAGE_SCALE);

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Unable to create finance PDF canvas');
    }

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.scale(PAGE_SCALE, PAGE_SCALE);
    context.drawImage(image, 0, 0, PAGE_WIDTH, PAGE_HEIGHT);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    return {
      bytes: Uint8Array.from(atob(dataUrl.split(',')[1]), (char) => char.charCodeAt(0)),
      width: canvas.width,
      height: canvas.height,
    };
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
};

const createPdfBlob = (images: PdfImage[]) => {
  const encoder = new TextEncoder();
  const chunks: BlobPart[] = [];
  const offsets: number[] = [];
  let length = 0;
  let objectId = 1;

  const toArrayBuffer = (bytes: Uint8Array) => {
    const buffer = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(buffer).set(bytes);
    return buffer;
  };

  const addBytes = (bytes: Uint8Array) => {
    chunks.push(toArrayBuffer(bytes));
    length += bytes.length;
  };

  const addText = (text: string) => addBytes(encoder.encode(text));

  const beginObject = (id: number) => {
    offsets[id] = length;
    addText(`${id} 0 obj\n`);
  };

  const endObject = () => addText('\nendobj\n');

  addText('%PDF-1.4\n%----\n');

  const catalogId = objectId++;
  const pagesId = objectId++;
  const pageObjects = images.map((image, index) => {
    const pageId = objectId++;
    const contentId = objectId++;
    const imageId = objectId++;
    const imageName = `Im${index + 1}`;

    beginObject(pageId);
    addText(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /XObject << /${imageName} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`
    );
    endObject();

    const content = `q\n${PAGE_WIDTH} 0 0 ${PAGE_HEIGHT} 0 0 cm\n/${imageName} Do\nQ`;
    beginObject(contentId);
    addText(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
    endObject();

    beginObject(imageId);
    addText(
      `<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.bytes.length} >>\nstream\n`
    );
    addBytes(image.bytes);
    addText('\nendstream');
    endObject();

    return pageId;
  });

  beginObject(catalogId);
  addText(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);
  endObject();

  beginObject(pagesId);
  addText(
    `<< /Type /Pages /Kids [${pageObjects.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageObjects.length} >>`
  );
  endObject();

  const xrefStart = length;
  addText(`xref\n0 ${objectId}\n0000000000 65535 f \n`);
  for (let id = 1; id < objectId; id += 1) {
    addText(`${String(offsets[id]).padStart(10, '0')} 00000 n \n`);
  }
  addText(
    `trailer\n<< /Size ${objectId} /Root ${catalogId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`
  );

  return new Blob(chunks, { type: 'application/pdf' });
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const downloadFinanceProjectsPdf = async (
  items: FinanceExportItem[],
  options: FinancePdfOptions = {}
) => {
  const date = new Date();
  const pages = chunkItems(items);
  const images: PdfImage[] = [];

  for (const [pageIndex, pageItems] of pages.entries()) {
    const svg = renderSvgPage({
      date,
      generatedBy: options.generatedBy,
      items: pageItems,
      pageIndex,
    });
    images.push(await svgToJpeg(svg));
  }

  const pdfBlob = createPdfBlob(images);
  const exportDate = date.toISOString().slice(0, 10);

  downloadBlob(pdfBlob, `finance-export-${exportDate}.pdf`);
};
