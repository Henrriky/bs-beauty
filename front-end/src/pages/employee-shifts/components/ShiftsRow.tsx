import { CheckIcon } from "@heroicons/react/16/solid";

interface EditableShift {
  shiftStart: string;
  shiftEnd: string;
  isBusy: boolean;
}

interface ShiftsRowProps {
  weekDays: string[];
  editableShifts: Record<string, EditableShift>;
  setEditableShifts: React.Dispatch<
    React.SetStateAction<Record<string, EditableShift>>
  >;
}

const ShiftsRow = ({
  weekDays,
  editableShifts,
  setEditableShifts,
}: ShiftsRowProps) => {
  const toggleIsBusy = (day: string) => {
    setEditableShifts((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isBusy: !prev[day].isBusy,
      },
    }));
  };

  return (
    <>
      <div className="flex font-semibold text-center">
        <div className="mr-9"></div>
        <div className="w-1/2 text-center pr-2">Início</div>
        <div className="w-1/2 text-center">Fim</div>
      </div>
      {weekDays.map((day, index) => {
        const shift = editableShifts[day];

        const handleChange = (
          field: "shiftStart" | "shiftEnd",
          value: string
        ) => {
          setEditableShifts((prev) => ({
            ...prev,
            [day]: {
              ...prev[day],
              [field]: value,
            },
          }));
        };

        return (
          <div key={index} className="flex items-center py-3">
            <div className="w-1/2 mr-5">
              <div className="relative">
                <input
                  type="checkbox"
                  id={`checkbox-${day}`}
                  checked={shift?.isBusy || false}
                  onChange={() => toggleIsBusy(day)}
                  className="peer hidden"
                />
                <label
                  htmlFor={`checkbox-${day}`}
                  className={`flex items-center justify-center w-5 h-5 border-2 rounded-xl transition-all duration-200 
                            ${shift?.isBusy ? "border-secondary-200" : "border-[#A4978A]"}`}
                >
                  {!shift?.isBusy && <CheckIcon />}
                </label>
              </div>
            </div>
            <div className="w-1/2 pr-2">
              <input
                type="time"
                className="bg-transparent w-full text-[#D9D9D9] focus:outline-none"
                value={shift?.shiftStart || "00:00"}
                onChange={(e) => handleChange("shiftStart", e.target.value)}
                style={{ borderBottom: "1px solid #A4978A" }}
              />
            </div>
            <div className="w-1/2 pl-2">
              <input
                type="time"
                className="bg-transparent w-full text-[#D9D9D9] focus:outline-none"
                value={shift?.shiftEnd || "00:00"}
                onChange={(e) => handleChange("shiftEnd", e.target.value)}
                style={{ borderBottom: "1px solid #A4978A" }}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ShiftsRow;
