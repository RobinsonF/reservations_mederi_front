export type Colors = 'success' | 'primary' | 'danger' | 'light' | 'sky'
  | 'yellow' | 'green' | 'red' | 'violet' | 'gray';

export type ObjColors = Record<string, Record<string, boolean>>;

export const COLORS: ObjColors = {
  success: {
    'bg-success': true,
    'hover:bg-success-hover': true,
    'focus:ring-success-focus': true,
    'text-white': true,
  }
}

