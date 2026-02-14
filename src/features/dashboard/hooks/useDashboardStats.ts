// Mock Data
const MONTHLY_TREND_DATA = [
  { name: 'ต.ค.', received: 45, completed: 30 },
  { name: 'พ.ย.', received: 52, completed: 48 },
  { name: 'ธ.ค.', received: 38, completed: 40 },
  { name: 'ม.ค.', received: 65, completed: 55 },
  { name: 'ก.พ.', received: 48, completed: 45 },
  { name: 'มี.ค.', received: 60, completed: 50 },
];

const TIME_DATA = [
  { name: 'เจาะจง < 100K', days: 7.2, fill: '#EAB308' },
  { name: 'เจาะจง 1-500K', days: 8.4, fill: '#F97316' },
  { name: 'เจาะจง > 500K', days: 14.5, fill: '#3B82F6' },
  { name: 'วิธีคัดเลือก', days: 21.1, fill: '#2563EB' },
  { name: 'e-bidding', days: 15.3, fill: '#1E40AF' },
];

const PIE_DATA = [
  { name: 'เจาะจง < 100K', value: 35, color: '#EAB308' },
  { name: 'เจาะจง 1-500K', value: 25, color: '#F97316' },
  { name: 'เจาะจง > 500K', value: 15, color: '#3B82F6' },
  { name: 'วิธีคัดเลือก', value: 10, color: '#6366F1' },
  { name: 'e-bidding', value: 15, color: '#1E40AF' },
];

const DISTRIBUTION_DATA = [
  { name: 'แผนจัดการจัดซื้อ', count: 15 },
  { name: 'รายงานขอซื้อ', count: 8 },
  { name: 'รายงานผลพิจารณา', count: 24 },
  { name: 'จัดทำร่างสัญญา', count: 14 },
  { name: 'ส่งงาน/ตรวจรับ', count: 5 },
];

const TEAM_DATA = [
  { name: 'นายกิตติ์วริศรา รัตนโชติโสภณ', total: 10, doing: 8, done: 2 },
  { name: 'น.ส.นรรัตน์ธรณ์ วิจิตรวงศ์ศิริ', total: 12, doing: 2, done: 10 },
  { name: 'น.ส.ปุณณภัทรโชติ เตชะธนบูรณ์', total: 17, doing: 15, done: 2 },
  { name: 'น.ส.ทิพปภานันท์ กังวานกนก', total: 8, doing: 4, done: 4 },
  { name: 'นางศิรพัชร์สรณ์ อมรเกียรติธำรง', total: 29, doing: 24, done: 5 },
];

export function useDashboardStats() {
  // In the future, replace this with useQuery
  return {
    trendData: MONTHLY_TREND_DATA,
    timeData: TIME_DATA,
    pieData: PIE_DATA,
    distributionData: DISTRIBUTION_DATA,
    teamData: TEAM_DATA,
    isLoading: false,
  };
}
