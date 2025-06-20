import {
  File,
  X,
  Upload,
  FileText,
  Image,
  FileArchive,
  FileCode,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

type InputFormProps = {
  handleAddItem: (e: React.FormEvent) => void;
  newItem: string;
  setNewItem: (newItem: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | null;
  clearFile: () => void;
};

const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  const docExtensions = ["pdf", "doc", "docx", "txt"];
  const sheetExtensions = ["xls", "xlsx", "csv"];
  const archiveExtensions = ["zip", "rar", "7z", "tar", "gz"];
  const codeExtensions = [
    "js",
    "ts",
    "jsx",
    "tsx",
    "html",
    "css",
    "json",
    "md",
  ];

  if (imageExtensions.includes(extension || ""))
    return <Image className="h-4 w-4" />;
  if (docExtensions.includes(extension || ""))
    return <FileText className="h-4 w-4" />;
  if (sheetExtensions.includes(extension || ""))
    return <FileSpreadsheet className="h-4 w-4" />;
  if (archiveExtensions.includes(extension || ""))
    return <FileArchive className="h-4 w-4" />;
  if (codeExtensions.includes(extension || ""))
    return <FileCode className="h-4 w-4" />;
  return <File className="h-4 w-4" />;
};

export default function InputForm({
  handleAddItem,
  newItem,
  setNewItem,
  fileInputRef,
  handleFileUpload,
  selectedFile,
  clearFile,
}: InputFormProps) {
  return (
    <form onSubmit={handleAddItem} className="w-full space-y-4">
      <div className="flex  flex-col sm:flex-row gap-3 w-full">
        <div className="relative flex-1">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Paste text, link, or upload a file"
            className="h-12 bg-background/50 backdrop-blur-sm border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-primary/90 hover:bg-primary"
            disabled={!newItem.trim() && !selectedFile}
          >
            <Upload className="h-5 w-5" />
            <span className="sr-only">Add item</span>
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.zip,.rar,.7z,.tar,.gz,.js,.ts,.jsx,.tsx,.html,.css,.json,.md"
            onChange={handleFileUpload}
            className="hidden"
            multiple={false}
          />
          <Button
            type="button"
            variant={selectedFile ? "outline" : "default"}
            size="lg"
            onClick={() => fileInputRef.current?.click()}
            className={`h-12 px-6 font-medium ${
              selectedFile
                ? "bg-background hover:bg-background/80"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            <File className="h-4 w-4 mr-2" />
            {selectedFile ? "Change" : "Upload File"}
          </Button>
        </div>
      </div>

      {selectedFile && (
        <Card className="p-4 my-2 rounded-lg border-dashed border-2 border-border/50 bg-background/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                {getFileIcon(selectedFile.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate max-w-[180px]">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB •{" "}
                  {selectedFile.type || "Unknown type"}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        </Card>
      )}
    </form>
  );
}
