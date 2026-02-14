import { Separator } from '@/components/ui/separator';

export function ScheduleRemarks() {
  return (
    <div className="xl:col-span-1">
      <div className="flex h-full flex-col rounded-xl border-2 border-rose-200 bg-rose-50">
        <div className="rounded-t-[10px] bg-rose-700 p-2 text-center font-bold text-white">
          หมายเหตุ
        </div>
        <div className="space-y-4 p-5 text-sm leading-relaxed text-slate-700">
          <p>
            <strong className="text-rose-700">
              1. การจัดซื้อจัดจ้างวิธีประกาศเชิญชวนทั่วไป (e-bidding)
            </strong>
            <br />
            แต่ละวงเงินงบประมาณใช้เวลาประกาศเผยแพร่เอกสารประกวดราคา ดังนี้
            <br />
            • 5 แสน - 5 ล้าน: 5 วันทำการ
            <br />
            • 5 ล้าน - 10 ล้าน: 10 วันทำการ
            <br />
            • 10 ล้าน - 50 ล้าน: 12 วันทำการ
            <br />• 50 ล้านขึ้นไป: 20 วันทำการ
          </p>
          <Separator className="bg-rose-200" />
          <p>
            <strong className="text-rose-700">2. การอุทธรณ์</strong>
            <br />
            หากมีผู้ยื่นข้อเสนอมากกว่า 2 ราย{' '}
            <span className="rounded bg-rose-100 px-1 font-bold text-rose-600">
              ต้องล่วงพ้นเวลาอุทธรณ์ (7 วันทำการ)
            </span>{' '}
            นับแต่วันประกาศผู้ชนะ จึงจะลงนามสัญญาได้
          </p>
          <Separator className="bg-rose-200" />
          <p>
            <strong className="text-rose-700">3. นโยบาย SMEs & MIT</strong>
            <br />
            กรุณาตรวจสอบว่าสามารถซื้อจาก SMEs หรือสินค้าไทย (MIT) ได้หรือไม่
            และระบุในเอกสารขอซื้อจ้างให้ชัดเจน
          </p>
          <div className="mt-2 rounded-lg border border-rose-200 bg-rose-100 p-3 font-medium text-rose-800">
            *** หากหน่วยงานใดไม่จัดซื้อจัดจ้างตามนี้
            ต้องมีบันทึกชี้แจงเหตุผลเสนอผู้มีอำนาจอนุมัติทุกครั้ง !!!
          </div>
        </div>
      </div>
    </div>
  );
}
