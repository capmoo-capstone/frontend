// Mock Data
const METHOD_STATS = [
  {
    title: 'เฉพาะเจาะจง < 1 แสน',
    count: 15,
    avgTime: 4.5,
    avgTimeMarket: 15.6,
    performance: 'excellent' as const,
  },
  {
    title: 'เฉพาะเจาะจง < 5 แสน',
    count: 8,
    avgTime: 12.4,
    avgTimeMarket: 15.6,
    performance: 'good' as const,
  },
  {
    title: 'วิธีคัดเลือก',
    count: 3,
    avgTime: 6.7,
    avgTimeMarket: 8.6,
    performance: 'good' as const,
  },
  {
    title: 'e-bidding',
    count: 2,
    avgTime: 25.4,
    avgTimeMarket: 20.0,
    performance: 'warning' as const,
  },
];

const CHART_DATA = [
  { name: 'เฉพาะเจาะจง < 1แสน', myTime: 4.5, teamTime: 15.6 },
  { name: 'เฉพาะเจาะจง < 5แสน', myTime: 12.4, teamTime: 15.6 },
  { name: 'วิธีคัดเลือก', myTime: 6.7, teamTime: 8.6 },
  { name: 'e-bidding', myTime: 25.4, teamTime: 20.0 },
];

const PROJECTS = [
  {
    date: '24 พ.ย. 2568',
    id: '68-00123',
    title: 'จัดซื้อครุภัณฑ์คอมพิวเตอร์ 10 เครื่อง',
    unit: 'สำนักงานมหาวิทยาลัย',
    status: 'In Progress' as const,
    statusLabel: 'กำลังดำเนินการ',
  },
  {
    date: '22 พ.ย. 2568',
    id: '68-00120',
    title: 'จ้างเหมาทำความสะอาด อาคาร 4',
    unit: 'คณะครุศาสตร์',
    status: 'Late' as const,
    statusLabel: 'ล่าช้ากว่ากำหนด',
  },
  {
    date: '20 พ.ย. 2568',
    id: '68-00115',
    title: 'ซื้อวัสดุสำนักงาน ไตรมาส 1',
    unit: 'คณะวิศวกรรมศาสตร์',
    status: 'Completed' as const,
    statusLabel: 'เสร็จสิ้น',
  },
  {
    date: '18 พ.ย. 2568',
    id: '68-00110',
    title: 'จ้างซ่อมแซมระบบไฟฟ้า',
    unit: 'สำนักงานวิทยทรัพยากร',
    status: 'Urgent' as const,
    statusLabel: 'เร่งด่วน',
  },
  {
    date: '15 พ.ย. 2568',
    id: '68-00098',
    title: 'จัดซื้อหนังสือเข้าห้องสมุด',
    unit: 'สำนักงานวิทยทรัพยากร',
    status: 'Returned' as const,
    statusLabel: 'ถูกส่งคืน (แก้ไข)',
  },
];

export function useStaffKpiStats() {
  // In the future, replace this with useQuery
  return {
    methodStats: METHOD_STATS,
    chartData: CHART_DATA,
    projects: PROJECTS,
    isLoading: false,
  };
}
