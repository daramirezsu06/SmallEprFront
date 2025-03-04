type TableProps<T> = {
  data: T[];
  columns: {
    name: string;
    selector: keyof T | ((row: T) => React.ReactNode); // Cambiamos string por React.ReactNode
  }[];
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
