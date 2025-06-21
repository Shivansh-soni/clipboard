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
    return <Image className='h-4 w-4' />;
  if (docExtensions.includes(extension || ""))
    return <FileText className='h-4 w-4' />;
  if (sheetExtensions.includes(extension || ""))
    return <FileSpreadsheet className='h-4 w-4' />;
  if (archiveExtensions.includes(extension || ""))
    return <FileArchive className='h-4 w-4' />;
  if (codeExtensions.includes(extension || ""))
    return <FileCode className='h-4 w-4' />;
  return <File className='h-4 w-4' />;
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
    <form onSubmit={handleAddItem} className='w-full space-y-4'>
      <div className='flex flex-col sm:flex-row gap-3 w-full'>
        <div className='relative flex-1'>
          <div className='relative'>
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder='Paste text, link, or upload a file'
              className='h-12 bg-background/50 backdrop-blur-sm border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pr-24'
            />
            <div className='absolute right-2 top-1/2 -translate-y-1/2 flex gap-2'>
              <Input
                ref={fileInputRef}
                type='file'
                accept='image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.zip,.rar,.7z,.tar,.gz,.js,.ts,.jsx,.tsx,.html,.css,.json,.md'
                onChange={handleFileUpload}
                className='hidden'
                multiple={false}
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => fileInputRef.current?.click()}
                className='h-8 w-8 rounded-full hover:bg-accent'
              >
                <Upload className='h-4 w-4' />
                <span className='sr-only'>Upload file</span>
              </Button>
            </div>
          </div>
        </div>

        <Button
          type='submit'
          size='lg'
          className='h-12 px-6 font-medium bg-primary/90 hover:bg-primary'
          disabled={!newItem.trim() && !selectedFile}
        >
          Add Item
        </Button>
      </div>

      {selectedFile && (
        <Card className='border-primary/20 bg-primary/5'>
          <div className='flex items-center justify-between p-3'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-md bg-primary/10'>
                {getFileIcon(selectedFile.name)}
              </div>
              <div>
                <p className='text-sm font-medium'>{selectedFile.name}</p>
                <p className='text-xs text-muted-foreground'>
                  {(selectedFile.size / 1024).toFixed(1)} KB •{" "}
                  {selectedFile.type || "Unknown type"}
                </p>
              </div>
            </div>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='h-8 w-8 text-muted-foreground hover:text-destructive'
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
            >
              <X className='h-4 w-4' />
              <span className='sr-only'>Remove file</span>
            </Button>
          </div>
        </Card>
      )}
    </form>
  );
}
