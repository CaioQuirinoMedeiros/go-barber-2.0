export type Provider = {
  id: string;
  name: string;
  avatar_url: string | null;
};

export type DayAvailabilityItem = {
  hour: number;
  available: boolean;
};

export type MonthAvailabilityItem = {
  day: number;
  available: boolean;
};

export type ProviderContainerProps = {
  selected: boolean;
};

export type ProviderNameProps = {
  selected: boolean;
};

export type HourProps = {
  available: boolean;
  selected: boolean;
};

export type HourTextProps = {
  selected: boolean;
};

export type WeekLetterProps = {
  active: boolean;
};

export type DateItemProps = {
  active?: boolean;
  disabled?: boolean;
};

export type CalendarIconProps = {
  highlight?: boolean;
};
