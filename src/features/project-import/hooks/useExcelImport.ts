import { useState } from 'react';

import readXlsxFile from 'read-excel-file';

import { type EditableImportRow, type ImportMode } from '../types';

export function useExcelImport(mode: ImportMode) {
  const [data, setData] = useState<EditableImportRow[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsParsing(true);
    try {
      const rows = await readXlsxFile(file);

      const headers = rows[0] as string[];
      const dataRows = rows.slice(1);

      const formattedData: EditableImportRow[] = dataRows.map((row) => {
        const rowObj: Record<string, any> = {};
        headers.forEach((header, colIndex) => {
          rowObj[header] = row[colIndex];
        });

        let deliveryDateStr = '';
        const excelDate = rowObj['วันที่ส่งมอบ'];
        if (excelDate instanceof Date) {
          deliveryDateStr = excelDate.toISOString().split('T')[0];
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
          fiscal_year: rowObj['ปีงบประมาณ']?.toString() || new Date().getFullYear().toString(),
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

  const updateRow = (rowIndex: number, columnId: string, value: any) => {
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
