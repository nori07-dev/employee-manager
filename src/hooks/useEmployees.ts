import { useState, useEffect } from 'react';
import { Employee } from '../types/employee';

const STORAGE_KEY = 'employee_management_data';

const initialEmployees: Employee[] = [
  {
    id: '1',
    name: '田中 太郎',
    department: '開発部',
    position: 'シニアエンジニア',
    email: 'tanaka.taro@company.com',
    phone: '090-1234-5678',
    employmentType: '正社員',
    hireDate: '2020-04-01',
    status: '在籍',
    userRole: '管理者',
  },
  {
    id: '2',
    name: '佐藤 花子',
    department: '営業部',
    position: '営業主任',
    email: 'sato.hanako@company.com',
    phone: '090-8765-4321',
    employmentType: '正社員',
    hireDate: '2021-07-15',
    status: '在籍',
    userRole: '一般社員',
  },
  {
    id: '3',
    name: '山田 次郎',
    department: '人事部',
    position: '人事担当',
    email: 'yamada.jiro@company.com',
    phone: '090-1111-2222',
    employmentType: '契約社員',
    hireDate: '2022-01-10',
    status: '在籍',
    userRole: '一般社員',
  },
];

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setEmployees(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to parse saved data:', error);
        setEmployees(initialEmployees);
      }
    } else {
      setEmployees(initialEmployees);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee = {
      ...employee,
      id: `emp_${Date.now()}`,
    };
    setEmployees(prev => [...prev, newEmployee]);
    return newEmployee;
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev =>
      prev.map(emp => (emp.id === id ? { ...emp, ...updates } : emp))
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const importEmployees = (newEmployees: Employee[]) => {
    setEmployees(newEmployees);
  };

  return {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    importEmployees,
  };
};