import { Employee, Role } from "../../../store/auth/types";

interface EmployeeCardProps {
  employee: Employee;
  onDelete: (employee: Employee) => void;
}

export function EmployeeCard({ employee, onDelete }: EmployeeCardProps) {
  return (
    <div className="p-4 mb-4 bg-secondary-100 text-primary-300 rounded-lg shadow-md relative">
      <p className="text-sm font-bold ">Nome:</p>
      <p className="text-xs">
        {employee.name === "Usuário"
          ? "Funcionário com cadastro não finalizado"
          : employee.name}
      </p>
      <p className="text-sm font-bold mt-2">E-mail:</p>
      <p className="text-xs">{employee.email}</p>
      <p className="text-sm font-bold mt-2">Cargo:</p>
      <p className="text-xs">
        {employee.role === Role.MANAGER ? "Gerente" : "Funcionário"}
      </p>

      {employee.role !== Role.MANAGER && (
        <button
          className="absolute top-2 right-2"
          onClick={() => onDelete(employee)}
        >
          X
        </button>
      )}
    </div>
  );
}
