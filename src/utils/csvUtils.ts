import { Employee } from '../types/employee';

export const parseCSV = (csvContent: string): Employee[] => {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(',');
    return {
      id: values[0] || `emp_${Date.now()}_${index}`,
      name: values[1] || '',
      department: values[2] || '',
      position: values[3] || '',
      email: values[4] || '',
      phone: values[5] || '',
      employmentType: (values[6] as Employee['employmentType']) || '正社員',
      hireDate: values[7] || '',
      status: (values[8] as Employee['status']) || '在籍',
      userRole: (values[9] as Employee['userRole']) || '一般社員',
    };
  });
};

export const generateCSV = (employees: Employee[]): string => {
  const headers = [
    'ID',
    '氏名',
    '所属',
    '役職',
    'メールアドレス',
    '電話番号',
    '雇用形態',
    '入社日',
    'ステータス',
    'ユーザー権限'
  ];
  
  const rows = employees.map(emp => [
    emp.id,
    emp.name,
    emp.department,
    emp.position,
    emp.email,
    emp.phone,
    emp.employmentType,
    emp.hireDate,
    emp.status,
    emp.userRole
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

export const downloadCSV = (csvContent: string, filename: string = 'employees.csv') => {
  const BOM = '\uFEFF'; // UTF-8 BOM for proper Japanese encoding
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};