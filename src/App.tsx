import React, { useState } from 'react';
import Header from './components/Header';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import { useEmployees } from './hooks/useEmployees';
import { parseCSV, generateCSV, downloadCSV } from './utils/csvUtils';
import { Employee, User } from './types/employee';

function App() {
  const { employees, addEmployee, updateEmployee, deleteEmployee, importEmployees } = useEmployees();
  
  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    name: '田中 太郎',
    role: '管理者',
  });
  
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleEmployeeSelect = (employee: Employee | null) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  const handleEmployeeDelete = (id: string) => {
    if (window.confirm('この従業員を削除してもよろしいですか？')) {
      deleteEmployee(id);
    }
  };

  const handleEmployeeSave = (employeeData: Omit<Employee, 'id'>) => {
    if (selectedEmployee) {
      updateEmployee(selectedEmployee.id, employeeData);
    } else {
      addEmployee(employeeData);
    }
    setShowForm(false);
    setSelectedEmployee(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedEmployee(null);
  };

  const handleCSVExport = () => {
    const csvContent = generateCSV(employees);
    downloadCSV(csvContent, `employees_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleCSVImport = async (file: File) => {
    try {
      const text = await file.text();
      const importedEmployees = parseCSV(text);
      
      if (window.confirm(`${importedEmployees.length}件の従業員データをインポートしますか？既存のデータは上書きされます。`)) {
        importEmployees(importedEmployees);
        alert('CSVファイルのインポートが完了しました。');
      }
    } catch (error) {
      console.error('CSV import error:', error);
      alert('CSVファイルの読み込みに失敗しました。ファイル形式を確認してください。');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} onUserChange={setCurrentUser} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmployeeList
          employees={employees}
          currentUser={currentUser}
          onEmployeeSelect={handleEmployeeSelect}
          onEmployeeDelete={handleEmployeeDelete}
          onCSVExport={handleCSVExport}
          onCSVImport={handleCSVImport}
        />
      </main>

      {showForm && (
        <EmployeeForm
          employee={selectedEmployee}
          currentUser={currentUser}
          onSave={handleEmployeeSave}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
}

export default App;