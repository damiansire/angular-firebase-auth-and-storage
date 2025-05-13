export interface Employee {
    id?: string;           // ID del documento en Firestore
    firstName: string;     // Nombre
    lastName: string;      // Apellido
    email: string;         // Email
    position: string;      // Cargo
    department: string;    // Departamento
    hireDate: Date;        // Fecha de contratación
    salary: number;        // Salario
    isActive: boolean;     // Estado activo/inactivo
    createdAt: Date;       // Fecha de creación del registro
    updatedAt: Date;       // Fecha de última actualización
} 