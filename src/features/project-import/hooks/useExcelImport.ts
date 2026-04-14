import { useState } from 'react';

import readXlsxFile from 'read-excel-file';

import { getFiscalYear } from '@/lib/formatters';

import { type EditableImportRow, type ImportMode } from '../types';

const parseExcelNumber = (value: unknown) => {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  const cleanValue = String(value).replace(/,/g, '').trim();
  const num = Number(cleanValue);
  return isNaN(num) ? 0 : num;
};

export function useExcelImport(mode: ImportMode) {
  const [data, setData] = useState<EditableImportRow[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsParsing(true);
    try {
      const rows = await readXlsxFile(file);

      const headers = rows[0] as string[];
      const dataRows = rows.slice(1);
      const defaultFiscalYear = getFiscalYear(new Date()).toString();

      const formattedData: EditableImportRow[] = dataRows.map((row) => {
        const rowObj: Record<string, unknown> = {};
        headers.forEach((header, colIndex) => {
          rowObj[header] = row[colIndex];
        });

        let deliveryDateStr = '';
        const excelDate = rowObj['วันที่ส่งมอบ'];
        if (excelDate instanceof Date) {
          deliveryDateStr = excelDate.toISOString().split('T')[0];
        }

        if (mode === 'budget') {
          return {
            _rowId: Math.random().toString(36).substring(7),
            budget_year: rowObj['ปีงบประมาณ']?.toString() || defaultFiscalYear,
            unit_no: rowObj['ศูนย์ต้นทุน']?.toString() || '',
            unit_id: rowObj['ชื่อศูนย์ต้นทุน']?.toString() || '',
            department_id:
              rowObj['หน่วยงาน']?.toString() || rowObj['สำนัก/หน่วยงาน']?.toString() || '',
            budget_no: rowObj['เงินทุน']?.toString() || '',
            budget_name: rowObj['ชื่อเงินทุน']?.toString() || '',
            activity_type: rowObj['ประเภทกิจกรรม']?.toString() || '',
            activity_type_name: rowObj['ชื่อประเภทกิจกรรม']?.toString() || '',
            description:
              rowObj['รายละเอียด']?.toString() ||
              rowObj['คำอธิบายเพิ่มเติมประเภทกิจกรรม']?.toString() ||
              '',
            amount: parseExcelNumber(
              rowObj['ราคารวม'] ?? rowObj['วงเงินงบประมาณ'] ?? rowObj['วงเงินงบประมาณ (บาท)']
            ),
          };
        }

        return {
          _rowId: Math.random().toString(36).substring(7),
          pr_no: rowObj['เลขที่ใบขอซื้อขอจ้าง']?.toString() || '',
          lesspaper_no:
            mode === 'lesspaper' ? rowObj['เลขที่รับจาก Less paper']?.toString() || '' : undefined,
          title: rowObj['โครงการ']?.toString() || '',
          description: rowObj['รายละเอียด']?.toString() || '',
          procurement_type:
            rowObj['วิธีการจัดหา']?.toString() || (mode === 'fiori' ? 'LT100K' : ''),
          delivery_date_str: deliveryDateStr,
          budget: Number(rowObj['วงเงินงบประมาณ']) || 0,
          department_id: rowObj['หน่วยงาน']?.toString() || '',
          unit_id: rowObj['ฝ่าย']?.toString() || '',
          fiscal_year: rowObj['ปีงบประมาณ']?.toString() || defaultFiscalYear,
        };
      });

      setData(formattedData);
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      alert('เกิดข้อผิดพลาดในการอ่านไฟล์ Excel กรุณาตรวจสอบรูปแบบไฟล์');
    } finally {
      setIsParsing(false);
    }
  };

  const updateRow = (rowIndex: number, columnId: string, value: unknown) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return { ...old[rowIndex]!, [columnId]: value };
        }
        return row;
      })
    );
  };

  const deleteRow = (rowIndex: number) => {
    setData((old) => old.filter((_, index) => index !== rowIndex));
  };

  return { data, setData, handleFileUpload, isParsing, updateRow, deleteRow };
}
