import { Pen, SquarePen } from 'lucide-react';

import type { ImportMode } from '../types';

interface Props {
  onSelect: (mode: ImportMode) => void;
}

const optionClasses =
  'group border-brand-6 bg-brand-3 flex h-64 w-64 cursor-pointer flex-col items-center justify-center gap-6 rounded-md border ' +
  'transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-brand-6 hover:shadow-md hover:bg-brand-3/50';

export function ImportSelector({ onSelect }: Props) {
  return (
    <>
      {/* Title */}
      <h1 className="h1-topic text-primary text-center">นำเข้าโครงการ</h1>

      <div className="flex flex-row flex-wrap items-center justify-center gap-12 pt-14">
        {/* Less Paper Excel */}
        <div className={optionClasses} onClick={() => onSelect('lesspaper')}>
          <SquarePen className="text-brand-11 h-14 w-14" />
          <p className="normal text-primary">อัปโหลดไฟล์ LessPaper</p>
        </div>

        {/* FIORI Excel */}
        <div className={optionClasses} onClick={() => onSelect('fiori')}>
          <img src="/assets/fiori-logo.svg" alt="FIORI Logo" className="h-14 py-1" />
          <p className="normal text-primary">อัปโหลดไฟล์ FIORI</p>
        </div>

        {/* Manual Form */}
        <div className={optionClasses} onClick={() => onSelect('manual')}>
          <Pen className="text-brand-11 h-14 w-14" />
          <p className="normal text-primary">กรอกข้อมูลด้วยตนเอง</p>
        </div>
      </div>
    </>
  );
}
