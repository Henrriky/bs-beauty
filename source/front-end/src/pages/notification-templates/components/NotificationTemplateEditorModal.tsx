import {
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/button/Button";
import { NotificationTemplate } from "../../../store/notification-template/types";
import { toast } from "react-toastify";

type ActiveField = "title" | "body" | null;
export type VariableExamples = Record<string, string>;

type Props = {
  isOpen: boolean;
  template: NotificationTemplate | null;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (data: { title: string; body: string }) => Promise<void> | void;
  variableExamples?: VariableExamples;
};

export default function NotificationTemplateEditorModal({
  isOpen,
  template,
  isSaving = false,
  onClose,
  onSave,
  variableExamples = {},
}: Props) {
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [activeField, setActiveField] = useState<ActiveField>(null);

  useEffect(() => {
    if (!isOpen || !template) return;
    setEditTitle(template.title || "");
    setEditBody(template.body || "");
    setShowPreview(false);
    setActiveField(null);
  }, [isOpen, template]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSaving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, isSaving, onClose]);

  const closeSafely = () => {
    if (!isSaving) onClose();
  };

  const dirty = useMemo(() => {
    if (!template) return false;
    return (
      editTitle.trim() !== (template.title ?? "") ||
      editBody.trim() !== (template.body ?? "")
    );
  }, [editTitle, editBody, template]);

  const insertVariable = (variable: string) => {
    const variableText = `{${variable}}`;
    if (activeField === "title") setEditTitle((p) => p + variableText);
    else if (activeField === "body") setEditBody((p) => p + variableText);
    else {
      setEditBody((p) => p + variableText);
      setActiveField("body");
    }
  };

  const renderPreview = (text: string) => {
    if (!template || !text) return text;
    let preview = text;
    template.variables?.forEach((variable) => {
      const regex = new RegExp(`{${variable}}`, "g");
      const example = variableExamples[variable] || `[${variable}]`;
      preview = preview.replace(regex, example);
    });
    return preview;
  };

  const handleSaveClick = async () => {
    const title = editTitle.trim();
    const body = editBody.trim();
    if (!title || !body) {
      toast.warn("Preencha título e mensagem antes de salvar.");
      return;
    }
    if (!dirty) {
      toast.info("Nada para salvar: nenhum campo foi alterado.");
      return;
    }
    await onSave({ title, body });
  };

  if (!isOpen || !template) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60"
      role="dialog"
      aria-modal="true"
      onClick={closeSafely}
    >
      <div
        className="relative w-full max-w-2xl bg-[#1E1E1E] rounded-2xl shadow px-7 py-6
                   max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-4 top-4 text-[#D9D9D9] hover:text-[#B19B86] transition"
          onClick={closeSafely}
          aria-label="Fechar modal"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="w-full space-y-4">
          <div className="text-center mb-2">
            <h2 className="text-base md:text-lg font-medium text-[#D9D9D9]">
              {template.name}
            </h2>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setShowPreview(!showPreview)}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5
                         bg-[#3B3B3B] hover:bg-[#B19B86]/20 rounded-lg
                         text-xs md:text-sm text-[#A5A5A5] hover:text-[#B19B86] transition-colors
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {showPreview ? (
                <EyeSlashIcon className="w-3.5 h-3.5" />
              ) : (
                <EyeIcon className="w-3.5 h-3.5" />
              )}
              {showPreview ? "Ocultar" : "Preview"}
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#D9D9D9]">Título</label>
            <textarea
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onFocus={() => setActiveField("title")}
              placeholder="Digite o título..."
              disabled={isSaving}
              className="w-full text-sm md:text-base text-[#A5A5A5] bg-[#1a1a1a]
                         border border-[#3B3B3B] rounded-xl px-3 py-3
                         focus:outline-none focus-within:border-[#B19B86] transition-colors duration-300 resize-none
                         disabled:opacity-60 disabled:cursor-not-allowed"
              rows={2}
            />
            {showPreview && (
              <div className="p-3 bg-[#272727] border border-[#3B3B3B] rounded-lg">
                <div className="text-sm text-[#A5A5A5] mb-1">Preview:</div>
                <div className="text-[#D9D9D9] text-xs md:text-sm">
                  {renderPreview(editTitle) || "Título vazio"}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#D9D9D9]">Mensagem</label>
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              onFocus={() => setActiveField("body")}
              placeholder="Digite a mensagem..."
              disabled={isSaving}
              className="w-full text-sm md:text-base text-[#A5A5A5] bg-[#1a1a1a]
                         border border-[#3B3B3B] rounded-xl px-3 py-3
                         focus:outline-none focus-within:border-[#B19B86] transition-colors duration-300 resize-none
                         disabled:opacity-60 disabled:cursor-not-allowed"
              rows={4}
            />
            {showPreview && (
              <div className="p-3 bg-[#272727] border border-[#3B3B3B] rounded-lg">
                <div className="text-xs text-[#A5A5A5] mb-1">Preview:</div>
                <div className="text-[#A5A5A5] text-xs md:text-sm whitespace-pre-wrap">
                  {renderPreview(editBody) || "Mensagem vazia"}
                </div>
              </div>
            )}
          </div>

          {!!template.variables?.length && (
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <SparklesIcon className="w-4 h-4 text-[#B19B86]" />
                <span className="text-xs text-[#A5A5A5]">Variáveis:</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {template.variables.map((variable) => (
                  <button
                    key={variable}
                    onClick={() => insertVariable(variable)}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5
                               px-3 py-2 rounded-lg border border-[#3B3B3B]
                               bg-[#272727] text-[12px] md:text-sm
                               text-[#B19B86] hover:bg-[#B19B86]/20 hover:text-[#D9D9D9]
                               transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ minHeight: 36, minWidth: 44 }}
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    {variable}
                  </button>
                ))}
              </div>

              <div className="text-xs text-[#A5A5A5] bg-[#3B3B3B]/30 p-2 rounded-md">
                {activeField
                  ? `Inserindo no: ${activeField === "title" ? "Título" : "Mensagem"}`
                  : "Clique em uma variável para inserir na mensagem"}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-3">
            <Button
              label="Cancelar"
              variant="outline"
              onClick={closeSafely}
              className="flex-1 py-3"
              disabled={isSaving}
            />
            <Button
              label={isSaving ? "Salvando..." : "Salvar"}
              variant="solid"
              onClick={handleSaveClick}
              disabled={!editTitle.trim() || !editBody.trim() || !dirty || isSaving}
              className="flex-1 py-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
