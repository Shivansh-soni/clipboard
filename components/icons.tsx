import * as React from "react";
import {
  Loader2,
  Lock,
  Mail,
  User,
  Clipboard,
  Menu,
  X,
  ChevronDown,
  Search,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Copy,
  Check,
  X as XIcon,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Eye,
  EyeOff,
  Loader,
} from "lucide-react";

type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logo: (props: IconProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
      <line x1='8' y1='12' x2='16' y2='12' />
      <line x1='12' y1='8' x2='12' y2='16' />
    </svg>
  ),
  google: (props: IconProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='currentColor'
      {...props}
    >
      <path
        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
        fill='#4285F4'
      />
      <path
        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
        fill='#34A853'
      />
      <path
        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z'
        fill='#FBBC05'
      />
      <path
        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
        fill='#EA4335'
      />
    </svg>
  ),
  spinner: Loader2,
  user: User,
  mail: Mail,
  lock: Lock,
  clipboard: Clipboard,
  menu: Menu,
  close: X,
  chevronDown: ChevronDown,
  search: Search,
  settings: Settings,
  logOut: LogOut,
  plus: Plus,
  trash: Trash2,
  edit: Edit,
  copy: Copy,
  check: Check,
  x: XIcon,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  checkCircle: CheckCircle,
  alertCircle: AlertCircle,
  info: Info,
  eye: Eye,
  eyeOff: EyeOff,
  loader: Loader,
};
