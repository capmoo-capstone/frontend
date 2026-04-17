interface ExcelUploadZoneProps {
  isParsing: boolean;
  onFileSelect: (file: File) => void;
}

export function ExcelUploadZone({ isParsing, onFileSelect }: ExcelUploadZoneProps) {
  return (
    <div className="relative flex min-h-100 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white p-16 transition-colors hover:bg-slate-50">
      <input
        type="file"
        accept=".xlsx, .xls"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        onChange={(e) => {
          if (e.target.files?.[0]) onFileSelect(e.target.files[0]);
        }}
        disabled={isParsing}
      />
      <div className="text-center">
        <p className="mb-2 text-lg font-bold text-[#8B3D6B]">
          {isParsing ? 'กำลังอ่านไฟล์...' : 'คลิกหรือลากไฟล์ Excel มาวางที่นี่'}
        </p>
        <p className="text-muted-foreground mt-2 text-sm">รองรับไฟล์ .xlsx และ .xls</p>
      </div>
    </div>
  );
}
