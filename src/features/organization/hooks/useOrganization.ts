import { useQuery } from '@tanstack/react-query';

// import axios from '@/lib/axios'; // Uncomment when ready

// Mock data for now
const MOCK_DEPTS = [{ id: 'dept-1', name: 'คณะวิศวกรรมศาสตร์' }];
const MOCK_UNITS = [{ id: 'unit-1', name: 'ฝ่ายเทคโนโลยีสารสนเทศ' }];

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
