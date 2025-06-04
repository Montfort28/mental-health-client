import React from 'react';
import { Filter, Clock, Target, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResourceType, ResourceDifficulty } from '../../types/resources';
import { colors } from '../../utils/colors';

interface ResourceFiltersProps {
  selectedType: ResourceType | null;
  onTypeChange: (type: ResourceType | null) => void;
  selectedDifficulty: ResourceDifficulty | null;
  onDifficultyChange: (difficulty: ResourceDifficulty | null) => void;
  selectedDuration: string | null;
  onDurationChange: (duration: string | null) => void;
}

const TYPE_OPTIONS = Object.entries(ResourceType).map(([key, value]) => ({
  value,
  label: key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, ' ')
}));

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

const DURATION_OPTIONS = [
  { value: '0-5', label: '< 5 minutes' },
  { value: '5-15', label: '5-15 minutes' },
  { value: '15-30', label: '15-30 minutes' },
  { value: '30-60', label: '30-60 minutes' },
  { value: '60', label: '> 60 minutes' }
];

interface FilterSelectProps<T extends string> {
  icon: React.ReactNode;
  label: string;
  value: T | null;
  options: { value: T; label: string }[];
  onChange: (value: T | null) => void;
}

function FilterSelect<T extends string>({
  icon,
  label,
  value,
  options,
  onChange
}: FilterSelectProps<T>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex items-center gap-2"
    >
      <div className="flex items-center gap-1" style={{ color: colors.charcoalGray.light }}>
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value as T || null)}
        className="px-3 py-2 rounded-lg border transition-all duration-300"
        style={{
          backgroundColor: colors.warmCream.light,
          borderColor: value ? colors.sageGreen.DEFAULT : colors.sageGreen.light,
          color: colors.charcoalGray.DEFAULT
        }}
      >
        <option value="">All</option>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </motion.div>
  );
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  selectedType,
  onTypeChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedDuration,
  onDurationChange
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap gap-4 items-center bg-white/50 backdrop-blur-lg p-4 rounded-xl shadow-sm mb-8"
    >
      <div className="flex items-center gap-2" style={{ color: colors.charcoalGray.light }}>
        <Filter size={20} />
        <span className="font-medium">Filters</span>
      </div>

      <FilterSelect
        icon={<BookOpen size={18} />}
        label="Type"
        value={selectedType}
        options={TYPE_OPTIONS}
        onChange={onTypeChange}
      />

      <FilterSelect
        icon={<Target size={18} />}
        label="Difficulty"
        value={selectedDifficulty}
        options={DIFFICULTY_OPTIONS}
        onChange={onDifficultyChange}
      />

      <FilterSelect
        icon={<Clock size={18} />}
        label="Duration"
        value={selectedDuration}
        options={DURATION_OPTIONS}
        onChange={onDurationChange}
      />
    </motion.div>
  );
};
