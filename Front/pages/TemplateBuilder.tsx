import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Save,
  Plus,
  Trash2,
  Wand2,
  ChevronDown,
  ChevronRight,
  Type,
  AlertCircle,
  FileText,
  Settings,
  Hash,
  List,
  MousePointerClick,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { useGetAccountChannels } from "@/services/channel.service";
import { useCreateTemplate } from "@/services/template.service";
import { SuccessAlert, ErrorAlert } from "@/components";
import {
  autoDetectFields,
  detectPatternCollection,
  getPatternCollection,
  generateRegexFromSelection as generateRegex,
} from "@/utilities/extraction.util";

// --- Types ---

type FieldType = "string" | "number" | "array";
type ExtractionMethod = "regex" | "marker";

interface FieldConfig {
  id: string;
  name: string; // e.g. "Entry Price"
  key: string; // e.g. "entry"
  type: FieldType;
  method: ExtractionMethod;
  regex: string;
  startMarker?: string;
  endMarker?: string;
  required: boolean;
  description?: string;
}

interface ExtractionResult {
  value: any;
  error?: string;
  matchIndex?: number;
}

const TemplateBuilder: React.FC = () => {
  // --- State ---
  const [templateName, setTemplateName] = useState("New Extraction Template");
  const [sampleText, setSampleText] = useState(
    "GOLD BUY NOW @ 2045.50\nSL: 2040\nTP1: 2050\nTP2: 2055"
  );

  const [fields, setFields] = useState<FieldConfig[]>([
    {
      id: "1",
      name: "Symbol",
      key: "symbol",
      type: "string",
      method: "regex",
      regex:
        "(?:^|\\s)(GOLD|SILVER|OIL|XAU|XAG|US30|SPX|BTC|ETH|[A-Z]{3,6}(?:USD|JPY|EUR|GBP|CHF|CAD|AUD|NZD|USDT)?)(?=\\s|$|BUY|SELL|LONG|SHORT)",
      required: true,
      description: "Asset Pair",
    },
    {
      id: "2",
      name: "Entry Price",
      key: "entry",
      type: "array",
      method: "regex",
      regex:
        "(?:Entry|EP|Entry\\s*Price|@|(?:BUY|SELL|LONG|SHORT))\\s*:?\\s*([0-9]+\\.?[0-9]*)(?:\\s+(?:[-–—]|to)?\\s*([0-9]+\\.?[0-9]*))?",
      required: true,
      description: "Entry point (single value or range)",
    },
  ]);

  const [preview, setPreview] = useState<Record<string, ExtractionResult>>({});
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>("1");
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // --- API Hooks ---
  const { data: channels, isLoading: channelsLoading } = useGetAccountChannels(
    {}
  );
  const createTemplateMutation = useCreateTemplate();

  // Set default channel when channels load
  useEffect(() => {
    if (channels && channels.length > 0 && !selectedChannel) {
      setSelectedChannel(channels[0].id);
    }
  }, [channels, selectedChannel]);

  // --- Logic ---

  // 1. Extract Data based on fields
  useEffect(() => {
    const result: Record<string, ExtractionResult> = {};

    fields.forEach((field) => {
      try {
        if (field.method === "regex") {
          if (!field.regex) {
            result[field.key] = { value: null, error: "Empty pattern" };
            return;
          }

          const regexFlags = field.type === "array" ? "gi" : "i";
          const regex = new RegExp(field.regex, regexFlags);

          if (field.type === "array") {
            const matches = [
              ...sampleText.matchAll(new RegExp(field.regex, "g")),
            ];
            // For entry ranges, capture both values if present
            const values = matches
              .map((m) => {
                // If second capture group exists (range), return both values
                if (m[2]) {
                  const val1 = parseFloat(m[1]);
                  const val2 = parseFloat(m[2]);
                  if (!isNaN(val1) && !isNaN(val2)) {
                    return [val1, val2];
                  }
                }
                // Otherwise, return single value
                const val = m[1] ? parseFloat(m[1]) : parseFloat(m[0]);
                return !isNaN(val) ? [val] : null;
              })
              .filter((v) => v !== null)
              .flat();
            result[field.key] = { value: values.length > 0 ? values : null };
          } else {
            const match = sampleText.match(regex);
            if (match && match[1]) {
              let val: any = match[1];
              if (field.type === "number") {
                val = parseFloat(val);
                if (isNaN(val)) throw new Error("NaN");
              }
              result[field.key] = { value: val, matchIndex: match.index };
            } else {
              result[field.key] = {
                value: null,
                error: field.required ? "Not found" : undefined,
              };
            }
          }
        }
        // Marker method logic could go here (simple substring between strings)
      } catch (e) {
        result[field.key] = { value: null, error: "Regex Error" };
      }
    });
    setPreview(result);
  }, [sampleText, fields]);

  // 2. Auto Detect
  const handleAutoDetect = () => {
    // First try to detect pattern collection
    const detectedCollection = detectPatternCollection(sampleText);

    let newFields: FieldConfig[] = [];

    if (detectedCollection) {
      // Use predefined pattern collection
      const patterns = getPatternCollection(detectedCollection);
      newFields = patterns.map((pattern, index) => ({
        id: Date.now().toString() + index,
        name: pattern.name,
        key: pattern.key,
        type: pattern.type,
        method: "regex" as ExtractionMethod,
        regex: pattern.regex,
        required: pattern.required,
        description: pattern.description,
      }));
    } else {
      // Fallback to auto-detection
      const detected = autoDetectFields(sampleText);
      newFields = detected.map((field, index) => ({
        id: Date.now().toString() + index,
        ...field,
      }));
    }

    if (newFields.length > 0) {
      setFields(newFields);
      setExpandedFieldId(newFields[0].id);
    }
  };

  // 4. Save Template
  const handleSaveTemplate = async () => {
    if (!selectedChannel) {
      setSaveError("Please select a channel");
      return;
    }

    // Validate required fields are present
    const missingRequiredFields = fields.filter(
      (f) => f.required && !preview[f.key]?.value
    );
    if (missingRequiredFields.length > 0) {
      setSaveError(
        `Required fields missing: ${missingRequiredFields
          .map((f) => f.name)
          .join(", ")}`
      );
      return;
    }

    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Prepare extraction config
      const extractionConfig = {
        fields: fields.map((f) => ({
          name: f.name,
          key: f.key,
          type: f.type,
          method: f.method,
          regex: f.regex,
          startMarker: f.startMarker,
          endMarker: f.endMarker,
          required: f.required,
          description: f.description,
        })),
      };

      await createTemplateMutation.mutateAsync({
        channel_id: selectedChannel,
        extraction_config: extractionConfig,
        test_message: sampleText || undefined,
        is_active: true,
      });

      setSaveSuccess(true);
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      setSaveError(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to save template"
      );
    }
  };

  // --- Render Components ---

  const renderFieldEditor = (field: FieldConfig, index: number) => {
    const isExpanded = expandedFieldId === field.id;
    const extraction = preview[field.key];

    return (
      <div
        key={field.id}
        className={`rounded-lg border transition-all duration-200 ${
          isExpanded
            ? "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 shadow-md"
            : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
        }`}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={() => setExpandedFieldId(isExpanded ? null : field.id)}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-1.5 rounded ${
                extraction?.value
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {field.type === "number" ? (
                <Hash size={14} />
              ) : field.type === "array" ? (
                <List size={14} />
              ) : (
                <Type size={14} />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {field.name}
              </p>
              <p className="text-xs text-slate-500 font-mono">{field.key}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {extraction?.value ? (
              <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-emerald-600 dark:text-emerald-400 max-w-[100px] truncate">
                {Array.isArray(extraction.value)
                  ? `[${extraction.value.join(", ")}]`
                  : extraction.value}
              </span>
            ) : (
              <span className="text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle size={12} /> Not Found
              </span>
            )}
            {isExpanded ? (
              <ChevronDown size={16} className="text-slate-400" />
            ) : (
              <ChevronRight size={16} className="text-slate-400" />
            )}
          </div>
        </div>

        {/* Expanded Editor */}
        {isExpanded && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 space-y-4 bg-slate-50/50 dark:bg-slate-950/30">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Field Name
                </label>
                <input
                  value={field.name}
                  onChange={(e) => {
                    const newFields = [...fields];
                    newFields[index].name = e.target.value;
                    setFields(newFields);
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  JSON Key
                </label>
                <input
                  value={field.key}
                  onChange={(e) => {
                    const newFields = [...fields];
                    newFields[index].key = e.target.value;
                    setFields(newFields);
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Data Type
                </label>
                <select
                  value={field.type}
                  onChange={(e) => {
                    const newFields = [...fields];
                    newFields[index].type = e.target.value as FieldType;
                    setFields(newFields);
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none"
                >
                  <option value="string">String (Text)</option>
                  <option value="number">Number (Decimal)</option>
                  <option value="array">Array (List)</option>
                </select>
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => {
                      const newFields = [...fields];
                      newFields[index].required = e.target.checked;
                      setFields(newFields);
                    }}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Required Field
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className=" text-xs font-semibold text-slate-500 mb-1 flex justify-between">
                <span>Regex Pattern</span>
                <a
                  href="https://regex101.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-400 hover:text-slate-600 hover:underline flex items-center gap-1"
                >
                  Test Regex <ExternalLink size={10} />
                </a>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-mono text-xs">
                  /
                </span>
                <input
                  value={field.regex}
                  onChange={(e) => {
                    const newFields = [...fields];
                    newFields[index].regex = e.target.value;
                    setFields(newFields);
                  }}
                  className="w-full pl-6 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-slate-500 outline-none"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-mono text-xs">
                  /{field.type === "array" ? "g" : "i"}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Use capture group <code>( )</code> to extract the value.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setFields(fields.filter((f) => f.id !== field.id));
                }}
                className="text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
              >
                <Trash2 size={14} /> Delete Field
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- Helper Icon for External Link
  const ExternalLink = ({
    size,
    className,
  }: {
    size: number;
    className?: string;
  }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-6 overflow-hidden">
      {/* Success/Error Messages */}
      {saveSuccess && <SuccessAlert message="Template saved successfully!" />}
      {saveError && <ErrorAlert message={saveError} />}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
            <FileText size={20} />
          </div>
          <div>
            <input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="text-lg font-bold text-slate-900 dark:text-white bg-transparent outline-none border-b border-transparent hover:border-slate-300 focus:border-slate-500 transition-colors w-full"
            />
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500">Channel:</span>
              {channelsLoading ? (
                <span className="text-xs text-slate-400">Loading...</span>
              ) : (
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 outline-none"
                  disabled={!channels || channels.length === 0}
                >
                  {channels && channels.length > 0 ? (
                    channels.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No channels available</option>
                  )}
                </select>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleAutoDetect}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm shadow-sm"
          >
            <Wand2 size={16} />{" "}
            <span className="hidden sm:inline">Smart Detect</span>
          </button>
          <button
            onClick={handleSaveTemplate}
            disabled={
              createTemplateMutation.isPending ||
              !selectedChannel ||
              channelsLoading
            }
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white font-bold rounded-lg transition-colors text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />{" "}
            {createTemplateMutation.isPending ? "Saving..." : "Save Template"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Left Column: Editor */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Sample Input */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex justify-between items-center rounded-t-xl">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Settings size={16} /> Source Message
              </h3>
            </div>
            <div className="p-2">
              <textarea
                ref={textareaRef}
                className="w-full h-32 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 font-mono text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                placeholder="Paste a sample signal message here..."
              />
              <p className="text-[10px] text-slate-400 mt-2 px-1">
                Tip: Highlight any text above and click "Create Field" to
                auto-generate a rule.
              </p>
            </div>
          </div>

          {/* Field List */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-0">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Fields Configuration
              </h3>
              <button
                onClick={() =>
                  setFields([
                    ...fields,
                    {
                      id: Date.now().toString(),
                      name: "New Field",
                      key: "new_field",
                      regex: "",
                      type: "string",
                      method: "regex",
                      required: true,
                    },
                  ])
                }
                className="text-xs bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3 py-1.5 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-1"
              >
                <Plus size={14} /> Add Field
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {fields.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Wand2 className="mx-auto mb-2 opacity-50" size={32} />
                  <p className="text-sm">No fields defined.</p>
                  <button
                    onClick={handleAutoDetect}
                    className="text-sm font-bold text-slate-900 dark:text-white hover:underline mt-2"
                  >
                    Auto-Detect Fields
                  </button>
                </div>
              ) : (
                fields.map((field, index) => renderFieldEditor(field, index))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="w-full lg:w-1/3 min-h-0 flex flex-col">
          <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950 rounded-t-xl shrink-0">
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                <Play size={16} className="text-emerald-500" /> Extraction
                Preview
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  JSON
                </span>
                <Copy
                  size={14}
                  className="text-slate-500 hover:text-slate-300 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-1">
              <span className="text-slate-500">{"{"}</span>
              {Object.entries(preview).map(([key, val], idx, arr) => {
                const result = val as ExtractionResult;
                return (
                  <div
                    key={key}
                    className="pl-4 group hover:bg-slate-800/50 rounded cursor-pointer"
                  >
                    <span className="text-purple-400">"{key}"</span>
                    <span className="text-slate-400">: </span>
                    {result.error ? (
                      <span className="text-rose-500 italic">
                        null{" "}
                        <span className="text-[10px] opacity-70">
                          /* {result.error} */
                        </span>
                      </span>
                    ) : (
                      <span
                        className={
                          typeof result.value === "number"
                            ? "text-orange-400"
                            : "text-emerald-400"
                        }
                      >
                        {JSON.stringify(result.value)}
                      </span>
                    )}
                    {idx < arr.length - 1 && (
                      <span className="text-slate-500">,</span>
                    )}
                  </div>
                );
              })}
              <span className="text-slate-500">{"}"}</span>
            </div>

            {/* Validation Summary */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </span>
                <div className="h-px bg-slate-800 flex-1"></div>
              </div>
              {fields.some((f) => f.required && !preview[f.key]?.value) ? (
                <div className="flex items-start gap-2 text-rose-400 bg-rose-900/20 p-2 rounded border border-rose-900/50">
                  <AlertCircle size={14} className="mt-0.5" />
                  <div>
                    <p className="font-bold">Validation Failed</p>
                    <p className="opacity-80">
                      Required fields missing:{" "}
                      {fields
                        .filter((f) => f.required && !preview[f.key]?.value)
                        .map((f) => f.name)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-900/20 p-2 rounded border border-emerald-900/50">
                  <CheckCircle2 size={14} />
                  <span className="font-bold">All required fields matched</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateBuilder;
