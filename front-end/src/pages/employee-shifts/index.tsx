import { ArrowLongLeftIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createShift,
  fetchEmployeeShifts,
  updateShift,
} from "../../api/shifts-api";
import { Button } from "../../components/button/Button";
import { WeekDays } from "../../enums/enums";
import useAppSelector from "../../hooks/use-app-selector";
import { Shift } from "../../store/auth/types";
import DaysRow from "./components/DaysRow";
import ShiftsRow from "./components/ShiftsRow";
import { useNavigate } from "react-router";

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

interface EditableShift {
  shiftStart: string;
  shiftEnd: string;
  isBusy: boolean;
}

const EmployeeShifts = () => {
  const accessToken = useAppSelector((state) => state.auth.token?.accessToken!);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [editableShifts, setEditableShifts] = useState<
    Record<string, { shiftStart: string; shiftEnd: string; isBusy: boolean }>
  >({});
  const weekDays = Object.values(WeekDays);

  const setEmployeeShiftsList = async () => {
    try {
      const response = await fetchEmployeeShifts(accessToken);
      setShifts(response.shifts);
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
  };

  const initializeEditableShifts = () => {
    const initialShifts: Record<string, EditableShift> = {};
    weekDays.forEach((day) => {
      const shift = getShiftByDay(day);
      initialShifts[day] = {
        shiftStart: shift ? formatTime(shift.shiftStart) : "",
        shiftEnd: shift ? formatTime(shift.shiftEnd) : "",
        isBusy: shift ? shift.isBusy : true,
      };
    });
    setEditableShifts(initialShifts);
  };

  useEffect(() => {
    document.title = "BS Beauty - Seus Horários";
    setEmployeeShiftsList();
  }, []);

  useEffect(() => {
    initializeEditableShifts();
  }, [shifts]);

  const getShiftByDay = (day: string) => {
    const backendDay = WeekDayMapping[day];
    return shifts.find((shift) => shift.weekDay === backendDay);
  };

  const handleSaveChanges = async () => {
    try {
      const updates = Object.entries(editableShifts).map(
        async ([day, shiftData]) => {
          const backendDay: WeekDays = WeekDayMapping[day] as WeekDays;
          const existingShift = getShiftByDay(day);

          const payload = {
            weekDay: backendDay,
            shiftStart: shiftData.shiftStart || "00:00",
            shiftEnd: shiftData.shiftEnd || "00:00",
            isBusy: shiftData.isBusy,
          };

          existingShift
            ? await updateShift(
              {
                shiftStart: payload.shiftStart,
                shiftEnd: payload.shiftEnd,
                isBusy: payload.isBusy,
              },
              existingShift.id,
              accessToken
            )
            : await createShift(payload, accessToken);
        }
      );

      await Promise.all(updates);

      await setEmployeeShiftsList();

      toast.success("Alterações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      toast.error("Erro ao salvar alterações.");
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <ArrowLongLeftIcon className="size-[30px] hover:size-9 transition-all fill-secondary-200 position absolute top-[25px] left-[25px] cursor-pointer" onClick={() => navigate("/home")} />
      <div className="p-4">
        <div className="flex flex-col gap-4 mt-11">
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
              <DaysRow weekDays={weekDays} editableShifts={editableShifts} />
            </div>
            <div>
              <ShiftsRow
                weekDays={weekDays}
                editableShifts={editableShifts}
                setEditableShifts={setEditableShifts}
              />
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
