import { Search } from 'lucide-react';

import { Input } from '../../../components/ui/input';

type SearchInputProps = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  wrapperClassName?: string;
  inputClassName?: string;
};

export function SearchInput({
  placeholder,
  value,
  onChange,
  wrapperClassName = 'relative min-w-[220px] flex-1 max-w-[320px]',
  inputClassName = 'h-9 pl-9',
}: SearchInputProps) {
  return (
    <div className={wrapperClassName}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className={inputClassName}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
