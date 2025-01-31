type SelectInputProps = {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { id: number; name: string }[];
  name: string; // Añadimos name como prop
};

const SelectInput = ({
  label,
  value,
  onChange,
  options,
  name,
}: SelectInputProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="font-semibold text-gray-700">{label}</label>
      <select
        name={name} // Asignamos el name aquí
        className="p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        value={value}
        onChange={onChange}>
        <option value="">Selecciona una opción</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
