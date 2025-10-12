import { PencilSquareIcon, TagIcon } from "@heroicons/react/24/outline";
import { memo } from "react";
import { NotificationTemplate } from "../../../store/notification-template/types";

type Props = {
  template: NotificationTemplate;
  onEdit: (tpl: NotificationTemplate) => void;
};

function NotificationTemplateCardBase({ template, onEdit }: Props) {
  const translateKey = (key: string) => {
    switch (key) {
      case "BIRTHDAY":
        return "ANIVERSÁRIO";
      default:
        return key;
    }
  }

  return (
    <div className="bg-[#222222] w-full text-left px-6 py-6 rounded-2xl">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h3 className="text-base font-medium text-white truncate group-hover:text-[#B19B86] transition-colors">
            {template.name || "Sem nome"}
          </h3>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => onEdit(template)}
              className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-all"
              title="Editar template"
              aria-label={`Editar ${template.name || "template"}`}
            >
              <PencilSquareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-400 line-clamp-2">
          {template.description || "Sem descrição"}
        </p>
        <div className="flex items-center gap-3 mt-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] bg-white/5 text-gray-300 ring-1 ring-white/10">
            <TagIcon className="size-3.5" />
            {translateKey(template.key)}
          </span>
        </div>
      </div>
    </div>
  );
}

export const NotificationTemplateCard = memo(NotificationTemplateCardBase);
