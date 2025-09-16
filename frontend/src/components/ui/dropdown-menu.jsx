import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

export const DropdownMenuContent = React.forwardRef(({ className = '', align = 'end', sideOffset = 6, ...props }, ref) => (
  <DropdownMenuPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={`z-50 min-w-[12rem] overflow-hidden rounded-2xl border border-white/10 bg-white/90 dark:bg-[#1F1F1F]/95 backdrop-blur-md p-2 text-gray-900 dark:text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]
      data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
      data-[state=open]:data-[side=bottom]:slide-in-from-top-2
      data-[state=open]:data-[side=top]:slide-in-from-bottom-2
      data-[state=open]:data-[side=left]:slide-in-from-right-2
      data-[state=open]:data-[side=right]:slide-in-from-left-2
      data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
      data-[state=closed]:data-[side=bottom]:slide-out-to-top-2
      data-[state=closed]:data-[side=top]:slide-out-to-bottom-2
      data-[state=closed]:data-[side=left]:slide-out-to-right-2
      data-[state=closed]:data-[side=right]:slide-out-to-left-2
      ${className}`}
    {...props}
  />
));

DropdownMenuContent.displayName = 'DropdownMenuContent';

export const DropdownMenuItem = React.forwardRef(({ className = '', inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={`relative flex cursor-pointer select-none items-center rounded-xl px-4 py-2.5 text-sm outline-none transition-colors hover:bg-orange-100/80 hover:text-orange-700 dark:hover:bg-orange-400/15 dark:hover:text-orange-300 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${inset ? 'pl-8' : ''} ${className}`}
    {...props}
  />
));

DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuLabel = ({ className = '', inset, ...props }) => (
  <DropdownMenuPrimitive.Label className={`px-2 py-1.5 text-xs font-semibold text-gray-300 ${inset ? 'pl-8' : ''} ${className}`} {...props} />
);

export const DropdownMenuSeparator = ({ className = '', ...props }) => (
  <DropdownMenuPrimitive.Separator className={`-mx-1 my-1 h-px bg-gray-700 ${className}`} {...props} />
);

export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuSubTrigger = DropdownMenuPrimitive.SubTrigger;
export const DropdownMenuSubContent = DropdownMenuPrimitive.SubContent;
export const DropdownMenuCheckboxItem = DropdownMenuPrimitive.CheckboxItem;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const DropdownMenuRadioItem = DropdownMenuPrimitive.RadioItem;
export const DropdownMenuShortcut = ({ className = '', ...props }) => (
  <span className={`ml-auto text-xs tracking-widest opacity-60 ${className}`} {...props} />
);


