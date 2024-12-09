import { ArrowLongLeftIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import {
  createShift,
  fetchShiftsFromEmployee,
  updateShift,
} from "../../api/shifts-api";
import { Button } from "../../components/button/Button";
import { WeekDays } from "../../enums/enums";
import useAppSelector from "../../hooks/use-app-selector";
import { Shift } from "../../store/auth/types";
import { CheckIcon } from "@heroicons/react/16/solid";

const EmployeeShifts = () => {
  const accessToken = useAppSelector((state) => state.auth.token?.accessToken!);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [editableShifts, setEditableShifts] = useState<
    Record<string, { shiftStart: string; shiftEnd: string; isBusy: boolean }>
  >({});
  const weekDays = Object.values(WeekDays);

  useEffect(() => {
    document.title = "BS Beauty - Seus Horários";
  }, []);

  useEffect(() => {
    const getShifts = async () => {
      try {
        const response = await fetchShiftsFromEmployee(accessToken);
        console.log(response);
        setShifts(response.shifts);
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    };

    getShifts();
  }, []);

  useEffect(() => {
    const initialEditableShifts: Record<
      string,
      { shiftStart: string; shiftEnd: string; isBusy: boolean }
    > = {};

    weekDays.forEach((day) => {
      const shift = getShiftByDay(day);
      initialEditableShifts[day] = {
        shiftStart: shift ? formatTime(shift.shiftStart) : "",
        shiftEnd: shift ? formatTime(shift.shiftEnd) : "",
        isBusy: shift ? shift.isBusy : true,
      };
    });
    setEditableShifts(initialEditableShifts);
  }, [shifts]);

  //TODO: Adicionar botão toggle para isBusy

  const WeekDayMapping: { [key: string]: string } = {
    Domingo: "SUNDAY",
    Segunda: "MONDAY",
    Terça: "TUESDAY",
    Quarta: "WEDNESDAY",
    Quinta: "THURSDAY",
    Sexta: "FRIDAY",
    Sábado: "SATURDAY",
  };

  const formatTime = (isoTime: string) => {
    if (!isoTime) return "";
    try {
      const date = new Date(isoTime);
      return date.toISOString().slice(11, 16);
    } catch (error) {
      console.error("Invalid ISO time:", isoTime);
      return "";
    }
  };

  const getShiftByDay = (day: string) => {
    const backendDay = WeekDayMapping[day];
    return shifts.find((shift) => shift.weekDay === backendDay);
  };

  const handleSaveChanges = async () => {
    try {
      const updates = Object.entries(editableShifts).map(
        async ([day, { shiftStart, shiftEnd, isBusy }]) => {
          const backendDay: WeekDays = WeekDayMapping[day] as WeekDays;
          const existingShift = getShiftByDay(day);

          const formattedShiftStart = shiftStart || "00:00";
          const formattedShiftEnd = shiftEnd || "00:00";

          if (existingShift) {
            console.log("Updating shift:", existingShift);
            return await updateShift(
              {
                shiftStart: formattedShiftStart,
                shiftEnd: formattedShiftEnd,
                isBusy,
              },
              existingShift.id,
              accessToken
            );
          } else {
            console.log("Creating new shift for day:", day);
            return await createShift(
              {
                weekDay: backendDay,
                shiftStart: formattedShiftStart,
                shiftEnd: formattedShiftEnd,
                isBusy,
              },
              accessToken
            );
          }
        }
      );

      await Promise.all(updates);
      alert("Alterações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      alert("Erro ao salvar alterações.");
    }
  };

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
      <ArrowLongLeftIcon className="size-[30px] fill-secondary-200 position absolute top-[25px] left-[25px]" />
      <div className="p-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-[#D9D9D9] text-lg">Horários</h2>
          <p className="text-primary-200 text-sm">
            Defina seus horários de expediente
          </p>
        </div>
        <div className="mt-6 flex flex-col items-center gap-6">
          <div
            className="grid grid-cols-2 w-full gap-x-4 text-[#D9D9D9] text-sm"
            style={{ gridTemplateColumns: "3fr 1fr" }}
          >
            <div>
              <div className="font-semibold pb-4">Dia</div>
              {Object.values(WeekDays).map((day, index) => {
                const shift = editableShifts[day];
                const isInactive = shift?.isBusy ?? true;
                return (
                  <div
                    key={index}
                    className={`pb-7 ${isInactive ? "text-primary-200" : "text-[#D9D9D9]"}`}
                    style={{ paddingBottom: "1.65rem" }}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            <div>
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
                        onChange={(e) =>
                          handleChange("shiftStart", e.target.value)
                        }
                        style={{ borderBottom: "1px solid #A4978A" }}
                      />
                    </div>
                    <div className="w-1/2 pl-2">
                      <input
                        type="time"
                        className="bg-transparent w-full text-[#D9D9D9] focus:outline-none"
                        value={shift?.shiftEnd || "00:00"}
                        onChange={(e) =>
                          handleChange("shiftEnd", e.target.value)
                        }
                        style={{ borderBottom: "1px solid #A4978A" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Button
            label="Salvar alterações"
            variant="solid"
            className="w-[50%]"
            onClick={handleSaveChanges}
          />
        </div>
      </div>
    </>
  );
};

export default EmployeeShifts;
