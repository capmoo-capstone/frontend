import { useQuery } from '@tanstack/react-query';

// import axios from '@/lib/axios'; // Uncomment when ready

// Mock data for now
const MOCK_DEPTS = [
  { id: 'dept-1', name: 'คณะวิศวกรรมศาสตร์' },
  { id: 'dept-2', name: 'คณะวิทยาศาสตร์' },
  { id: 'dept-3', name: 'คณะบริหารธุรกิจ' },
  { id: 'dept-4', name: 'คณะมนุษยศาสตร์และสังคมศาสตร์' },
  { id: 'dept-5', name: 'คณะศิลปกรรมศาสตร์' },
  { id: 'dept-6', name: 'คณะศึกษาศาสตร์' },
];
const MOCK_UNITS = [
  { id: 'unit-1', name: 'ฝ่ายเทคโนโลยีสารสนเทศ' },
  { id: 'unit-2', name: 'ฝ่ายวิชาการ' },
  { id: 'unit-3', name: 'ฝ่ายบริหารงานทั่วไป' },
  { id: 'unit-4', name: 'ฝ่ายวิจัยและนวัตกรรม' },
];

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      // const { data } = await axios.get('/api/departments');
      // return data;
      return MOCK_DEPTS;
    },
  });
}

export function useUnits(departmentId: string) {
  return useQuery({
    queryKey: ['units', departmentId],
    queryFn: async () => {
      // const { data } = await axios.get(`/api/units?department_id=${departmentId}`);
      // return data;
      return MOCK_UNITS;
    },
    enabled: !!departmentId,
  });
}
