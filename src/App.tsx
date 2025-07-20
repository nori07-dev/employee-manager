import React, { useState, useMemo } from 'react';
import { Employee, User, UserRole } from './types/Employee';
import { useEmployees } from './hooks/useEmployees';
import { exportToCSV, importFromCSV } from './utils/csvUtils';
import { LoginForm } from './components/LoginForm';
import { Header } from './components/Header';
import { SearchFilters } from './components/SearchFilters';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeForm } from './components/EmployeeForm';
import { Pagination } from './components/Pagination';
import { Plus, Download, Upload, Users } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState<keyof Employee | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    importEmployees
  } = useEmployees();

  // フィルタリングとソート
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter(employee => {
      const matchesSearch = !searchTerm || 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone.includes(searchTerm);
      
      const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
      const matchesStatus = !statusFilter || employee.status === statusFilter;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });

    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [employees, searchTerm, departmentFilter, statusFilter, sortField, sortDirection]);

  // ページネーション
  const totalPages = Math.ceil(filteredAndSortedEmployees.length / itemsPerPage);
  const currentEmployees = filteredAndSortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setSearchTerm('');
    setDepartmentFilter('');
    setStatusFilter('');
    setCurrentPage(1);
    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  const handleRoleChange = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('この従業員を削除してもよろしいですか？')) {
      deleteEmployee(id);
    }
  };

  const handleFormSave = (employeeData: Omit<Employee, 'id'>) => {
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, employeeData);
    } else {
      addEmployee(employeeData);
    }
    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  const handleExport = () => {
    exportToCSV(filteredAndSortedEmployees);
  };

  const handleImport = async () => {
    try {
      const importedEmployees = await importFromCSV();
      importEmployees(importedEmployees);
      alert(`${importedEmployees.length}件の従業員データをインポートしました。`);
    } catch (error) {
      alert('CSVファイルのインポートに失敗しました。');
    }
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onRoleChange={handleRoleChange} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">従業員一覧</h1>
              <p className="text-gray-600 mt-1">
                全{filteredAndSortedEmployees.length}名の従業員情報
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>CSVエクスポート</span>
            </button>
            
            {user.role === 'admin' && (
              <>
                <button
                  onClick={handleImport}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-md transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>CSVインポート</span>
                </button>
                
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>新規登録</span>
                </button>
              </>
            )}
          </div>
        </div>

        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          departmentFilter={departmentFilter}
          onDepartmentFilterChange={setDepartmentFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <EmployeeTable
          employees={currentEmployees}
          userRole={user.role}
          onEdit={handleEdit}
          onDelete={handleDelete}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredAndSortedEmployees.length}
          itemsPerPage={itemsPerPage}
        />

        <EmployeeForm
          employee={editingEmployee || undefined}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
          isOpen={isFormOpen}
        />
      </main>
    </div>
  );
}

export default App;