// Definir un tipo genérico para el selector, que puede ser una cadena o una función de acceso.
type TableProps<T> = {
  data: T[];
  columns: { name: string; selector: keyof T | ((row: T) => string) }[]; // Cambiar selector para que pueda ser una función
};

export const Table = <T,>({ data, columns }: TableProps<T>) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full table-auto text-left">
        <thead className="bg-gray-100 border-b">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-2 py-2 text-sm font-medium text-gray-700">
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-2 py-2 text-sm text-gray-900">
                  {/* Usamos el selector, que ahora puede ser una función */}
                  {typeof column.selector === "function"
                    ? column.selector(row)
                    : String(row[column.selector] || "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
