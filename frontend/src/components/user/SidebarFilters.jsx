import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const ALL_BRANDS = ['IKEA', 'Dell', 'Sony', 'Epson', 'Featherlite', 'BenQ', 'Sleepwell', 'ASUS'];

const ALL_COLORS = [
  { hex: '#000000', name: 'Black' },
  { hex: '#ffffff', name: 'White' },
  { hex: '#94a3b8', name: 'Silver' },
  { hex: '#475569', name: 'Charcoal' },
  { hex: '#3b82f6', name: 'Blue' },
  { hex: '#ef4444', name: 'Red' },
  { hex: '#10b981', name: 'Green' },
  { hex: '#b45309', name: 'Oak' },
];

const ALL_DURATIONS = ['All Durations', '1 Month', '6 Month', '1 Year', '2 Years', '3 Years'];

/* ── Collapsible Section ── */
function FilterSection({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-1 py-3 text-sm font-semibold text-foreground hover:text-primary transition-colors"
      >
        {title}
        <ChevronDown
          size={16}
          className={cn('text-muted-foreground transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          open ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        {children}
      </div>
    </div>
  );
}

export const SidebarFilters = ({
  selectedBrands,
  onBrandChange,
  selectedColor,
  onColorChange,
  selectedDuration,
  onDurationChange,
  priceRange,
  onPriceChange,
}) => {
  const handleBrandToggle = (brand) => {
    if (selectedBrands.includes(brand)) {
      onBrandChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onBrandChange([...selectedBrands, brand]);
    }
  };

  return (
    <div className="w-full">
      <h2 className="mb-3 px-1 text-base font-bold tracking-tight text-foreground">Filters</h2>

      {/* ── Brand ── */}
      <FilterSection title="Brand">
        <div className="space-y-1 px-1">
          {ALL_BRANDS.map((brand) => {
            const checked = selectedBrands.includes(brand);
            return (
              <label
                key={brand}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-accent transition-colors"
              >
                <span
                  className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                    checked
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input bg-background'
                  )}
                  onClick={() => handleBrandToggle(brand)}
                >
                  {checked && <Check size={10} strokeWidth={3} />}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => handleBrandToggle(brand)}
                />
                <span className={cn(checked ? 'font-medium text-foreground' : 'text-muted-foreground')}>
                  {brand}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* ── Color ── */}
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2.5 px-1">
          {ALL_COLORS.map((color) => {
            const isSelected = selectedColor === color.hex;
            return (
              <button
                key={color.hex}
                type="button"
                onClick={() => onColorChange(isSelected ? '' : color.hex)}
                title={color.name}
                className={cn(
                  'h-7 w-7 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  color.hex === '#ffffff' && 'border border-slate-200 dark:border-slate-600',
                  isSelected && 'ring-2 ring-primary ring-offset-2 scale-110'
                )}
                style={{ backgroundColor: color.hex }}
                aria-label={color.name}
                aria-pressed={isSelected}
              />
            );
          })}
        </div>
      </FilterSection>

      {/* ── Duration ── */}
      <FilterSection title="Duration">
        <div className="px-1">
          <select
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={selectedDuration}
            onChange={(e) => onDurationChange(e.target.value)}
          >
            {ALL_DURATIONS.map((dur) => (
              <option key={dur} value={dur}>
                {dur}
              </option>
            ))}
          </select>
        </div>
      </FilterSection>

      {/* ── Price Range ── */}
      <FilterSection title="Price Range">
        <div className="space-y-4 px-1">
          {/* Dual range — native range stacked */}
          <div className="relative h-2 rounded-full bg-muted">
            <div
              className="absolute h-2 rounded-full bg-primary"
              style={{
                left: `${(priceRange[0] / 250000) * 100}%`,
                right: `${100 - (priceRange[1] / 250000) * 100}%`,
              }}
            />
            <input
              type="range"
              min={0}
              max={250000}
              step={5000}
              value={priceRange[0]}
              onChange={(e) => {
                const val = Math.min(Number(e.target.value), priceRange[1] - 5000);
                onPriceChange([val, priceRange[1]]);
              }}
              className="pointer-events-none absolute inset-0 h-2 w-full appearance-none bg-transparent accent-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow"
            />
            <input
              type="range"
              min={0}
              max={250000}
              step={5000}
              value={priceRange[1]}
              onChange={(e) => {
                const val = Math.max(Number(e.target.value), priceRange[0] + 5000);
                onPriceChange([priceRange[0], val]);
              }}
              className="pointer-events-none absolute inset-0 h-2 w-full appearance-none bg-transparent accent-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow"
            />
          </div>
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span className="rounded-md bg-muted px-2 py-0.5">₹{priceRange[0].toLocaleString()}</span>
            <span className="rounded-md bg-muted px-2 py-0.5">₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </FilterSection>
    </div>
  );
};

export default SidebarFilters;
