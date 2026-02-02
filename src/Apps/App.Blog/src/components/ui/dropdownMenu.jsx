// src/components/ui/dropdown-menu.jsx
import { Menu } from '@headlessui/react';

export function DropdownMenu({ children }) {
  return <Menu as="div" className="relative inline-block">{children}</Menu>;
}

export function DropdownMenuTrigger({ children, asChild }) {
  return (
    <Menu.Button as={asChild ? 'div' : 'button'} className="focus:outline-none">
      {children}
    </Menu.Button>
  );
}

export function DropdownMenuContent({ children }) {
  return (
    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
      {children}
    </Menu.Items>
  );
}

export function DropdownMenuItem({ children, onClick, className = '' }) {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          className={`${className} ${
            active ? 'bg-blue-100' : ''
          } w-full text-left px-4 py-2 text-sm text-gray-700`}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
}
