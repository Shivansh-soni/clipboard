import { ImageIcon, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type InputFormProps = {
  handleAddItem: (e: React.FormEvent) => void;
  newItem: string;
  setNewItem: (newItem: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export default function InputForm(props: InputFormProps) {
  return (
    <form
      onSubmit={props.handleAddItem}
      className='flex flex-col sm:flex-row  w-full  mb-4 items-center gap-3'
    >
      <div className='flex items-center space-x-2 relative w-full'>
        <Input // type='url'
          value={props.newItem}
          onChange={(e) => props.setNewItem(e.target.value)}
          placeholder='Add a new item'
          className='flex-grow bg-gray-700 text-white border-gray-600 focus:border-blue-500'
        />
        <Button
          type='submit'
          className='bg-blue-600 text-white hover:bg-blue-700 absolute  right-0'
        >
          <Plus className='h-4 w-4  text-white' />
        </Button>
      </div>
      <div className='flex items-center justify-center'>
        <Input
          ref={props.fileInputRef}
          type='file'
          accept='image/*'
          onChange={props.handleImageUpload}
          className='hidden'
        />
        <Button
          onClick={() => props.fileInputRef.current?.click()}
          className='bg-black text-white hover:bg-black hover:drop-shadow-lg '
        >
          <ImageIcon className='h-4 w-4 mr-2' /> Add Image
        </Button>
      </div>
    </form>
  );
}
