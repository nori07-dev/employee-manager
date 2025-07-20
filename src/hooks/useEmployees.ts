import { useState, useEffect } from 'react';
import { Employee } from '../types/Employee';

const STORAGE_KEY = 'employee_management_data';

// サンプルデータ
const sampleEmployees: Employee[] = [
  {
    id: '1',
    name: '田中 太郎',
    department: '営業部',
    position: '部長',
    email: 'tanaka@company.com',
    phone: '090-1234-5678',
    employmentType: '正社員',
    hireDate: '2020-04-01',
    status: '在籍'
  },
  {
    id: '2',
    name: '佐藤 花子',
    department: '開発部',
    position: 'エンジニア',
    email: 'sato@company.com',
    phone: '090-2345-6789',
    employmentType: '正社員',
    hireDate: '2021-07-15',
    status: '在籍'
  },
  {
    id: '3',
    name: '鈴木 次郎',
    department: '総務部',
    position: '主任',
    email: 'suzuki@company.com',
    phone: '090-3456-7890',
    employmentType: '契約社員',
    hireDate: '2019-10-01',
    status: '在籍'
  },
  {
    id: '4',
    name: '高橋 美咲',
    department: 'マーケティング部',
    position: 'スペシャリスト',
    email: 'takahashi@company.com',
    phone: '090-4567-8901',
    employmentType: '正社員',
    hireDate: '2022-02-01',
    status: '在籍'
  },
  {
    id: '5',
    name: '山田 孝志',
    department: '営業部',
    position: '課長',
    email: 'yamada@company.com',
    phone: '090-5678-9012',
    employmentType: '正社員',
    hireDate: '2018-08-20',
    status: '退職'
  }
];

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEmployees(JSON.parse(stored));
      } catch {
        setEmployees(sampleEmployees);
      }
    } else {
      setEmployees(sampleEmployees);
    }
  }, []);

  const saveEmployees = (newEmployees: Employee[]) => {
    setEmployees(newEmployees);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEmployees));
  };

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    saveEmployees([...employees, newEmployee]);
  };

  const updateEmployee = (id: string, employee: Omit<Employee, 'id'>) => {
    const updatedEmployees = employees.map(emp => 
      emp.id === id ? { ...employee, id } : emp
    );
    saveEmployees(updatedEmployees);
  };

  const deleteEmployee = (id: string) => {
    const filteredEmployees = employees.filter(emp => emp.id !== id);
    saveEmployees(filteredEmployees);
  };

  const importEmployees = (newEmployees: Employee[]) => {
    saveEmployees(newEmployees);
  };

  return {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    importEmployees
  };
};