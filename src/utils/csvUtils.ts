import { Employee } from '../types/Employee';

export const exportToCSV = (employees: Employee[]): void => {
  const headers = ['ID', '氏名', '所属', '役職', 'メール', '電話番号', '雇用形態', '入社日', 'ステータス'];
  const csvContent = [
    headers.join(','),
    ...employees.map(emp => [
      emp.id,
      `"${emp.name}"`,
      `"${emp.department}"`,
      `"${emp.position}"`,
      emp.email,
      emp.phone,
      emp.employmentType,
      emp.hireDate,
      emp.status
    ].join(','))
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseCSV = (csvContent: string): Employee[] => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',');
  const employees: Employee[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(value => value.replace(/^"|"$/g, '').trim());
    
    if (values.length >= 9) {
      employees.push({
        id: values[0] || `emp_${Date.now()}_${i}`,
        name: values[1] || '',
        department: values[2] || '',
        position: values[3] || '',
        email: values[4] || '',
        phone: values[5] || '',
        employmentType: (values[6] as Employee['employmentType']) || '正社員',
        hireDate: values[7] || '',
        status: (values[8] as Employee['status']) || '在籍'
      });
    }
  }

  return employees;
};

export const importFromCSV = (): Promise<Employee[]> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('ファイルが選択されていません'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvContent = e.target?.result as string;
          const employees = parseCSV(csvContent);
          resolve(employees);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
      reader.readAsText(file, 'UTF-8');
    };
    input.click();
  });
};