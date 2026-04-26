import { getResponsibleTypeFormat } from '@/features/projects';

import type { FinanceExportItem } from '../types';
import { getFinanceStatusFormat } from './financeFormatters';

const PAGE_WIDTH = 842;
const PAGE_HEIGHT = 595;
const PAGE_SCALE = 2;
const ROWS_PER_PAGE = 14;
const MARGIN_X = 32;
const HEADER_Y = 92;
const ROW_HEIGHT = 30;

const COLUMNS = [
  { label: 'เลขที่ลงรับ', x: 36, width: 86 },
  { label: 'โครงการ', x: 130, width: 205 },
  { label: 'ผู้รับผิดชอบ', x: 344, width: 95 },
  { label: 'หน่วยงาน', x: 446, width: 92 },
  { label: 'วงเงินงบประมาณ', x: 546, width: 100 },
  { label: 'วิธีการจัดหา', x: 654, width: 82 },
  { label: 'สถานะการส่งออก', x: 744, width: 70 },
];

const encodeText = (value: string | number) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const truncateText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
};

const formatBudget = (budget: number) => `${budget.toLocaleString('th-TH')} บาท`;

const getRowValues = (item: FinanceExportItem) => [
  item.receive_no,
  truncateText(item.project_title, 40),
  truncateText(item.responsible_person, 18),
  truncateText(item.department_name, 18),
  formatBudget(item.budget),
  truncateText(getResponsibleTypeFormat(item.procurement_type).label, 16),
  getFinanceStatusFormat(item.export_status).label,
];

const chunkItems = (items: FinanceExportItem[]) => {
  const pages: FinanceExportItem[][] = [];
  for (let index = 0; index < items.length; index += ROWS_PER_PAGE) {
    pages.push(items.slice(index, index + ROWS_PER_PAGE));
  }
  return pages;
};

const renderSvgPage = (items: FinanceExportItem[], pageNumber: number, pageCount: number) => {
  const headerCells = COLUMNS.map(
    (column) =>
      `<text x="${column.x}" y="${HEADER_Y}" class="header">${encodeText(column.label)}</text>`
  ).join('');

  const rows = items
    .map((item, rowIndex) => {
      const rowY = HEADER_Y + 24 + rowIndex * ROW_HEIGHT;
      const values = getRowValues(item);
      const cells = values
        .map((value, columnIndex) => {
          const column = COLUMNS[columnIndex];
          const textAnchor = column.label === 'วงเงินงบประมาณ' ? 'end' : 'start';
          const x = textAnchor === 'end' ? column.x + column.width : column.x;
          return `<text x="${x}" y="${rowY + 19}" text-anchor="${textAnchor}" class="cell">${encodeText(value)}</text>`;
        })
        .join('');

      return `
        <rect x="${MARGIN_X}" y="${rowY}" width="${PAGE_WIDTH - MARGIN_X * 2}" height="${ROW_HEIGHT}" class="${rowIndex % 2 === 0 ? 'rowEven' : 'rowOdd'}" />
        ${cells}
      `;
    })
    .join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${PAGE_WIDTH}" height="${PAGE_HEIGHT}" viewBox="0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}">
      <style>
        .page { fill: #ffffff; }
        .title { fill: #111827; font: 700 20px 'Noto Sans Thai', Arial, sans-serif; }
        .meta { fill: #4b5563; font: 400 11px 'Noto Sans Thai', Arial, sans-serif; }
        .headerBg { fill: #f3f4f6; stroke: #d1d5db; stroke-width: 1; }
        .header { fill: #111827; font: 700 11px 'Noto Sans Thai', Arial, sans-serif; }
        .cell { fill: #111827; font: 400 10px 'Noto Sans Thai', Arial, sans-serif; }
        .rowEven { fill: #ffffff; stroke: #e5e7eb; stroke-width: 1; }
        .rowOdd { fill: #f9fafb; stroke: #e5e7eb; stroke-width: 1; }
      </style>
      <rect width="100%" height="100%" class="page" />
      <text x="${MARGIN_X}" y="38" class="title">ส่งออกรายงานให้การเงิน</text>
      <text x="${MARGIN_X}" y="60" class="meta">จำนวน ${items.length} รายการในหน้านี้</text>
      <text x="${PAGE_WIDTH - MARGIN_X}" y="60" text-anchor="end" class="meta">หน้า ${pageNumber}/${pageCount}</text>
      <rect x="${MARGIN_X}" y="72" width="${PAGE_WIDTH - MARGIN_X * 2}" height="32" rx="4" class="headerBg" />
      ${headerCells}
      ${rows}
    </svg>
  `;
};

const svgToJpeg = async (svg: string) => {
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
    canvas.width = PAGE_WIDTH * PAGE_SCALE;
    canvas.height = PAGE_HEIGHT * PAGE_SCALE;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Unable to create finance PDF canvas');
    }

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.scale(PAGE_SCALE, PAGE_SCALE);
    context.drawImage(image, 0, 0, PAGE_WIDTH, PAGE_HEIGHT);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    return {
      bytes: Uint8Array.from(atob(dataUrl.split(',')[1]), (char) => char.charCodeAt(0)),
      width: canvas.width,
      height: canvas.height,
    };
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
};

const createPdfBlob = (images: Array<{ bytes: Uint8Array; width: number; height: number }>) => {
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

export const downloadFinanceProjectsPdf = async (items: FinanceExportItem[]) => {
  const pages = chunkItems(items);
  const images = await Promise.all(
    pages.map((pageItems, index) => svgToJpeg(renderSvgPage(pageItems, index + 1, pages.length)))
  );
  const pdfBlob = createPdfBlob(images);
  const exportDate = new Date().toISOString().slice(0, 10);

  downloadBlob(pdfBlob, `finance-export-${exportDate}.pdf`);
};
