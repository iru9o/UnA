interface BadgeProps {
  station: 'cutting_board' | 'fry_station' | 'drink_station' | 'stove'
  className?: string
}

const stationColors = {
  cutting_board: 'bg-station-cutting text-bg-primary',
  fry_station: 'bg-station-fry text-bg-primary',
  drink_station: 'bg-station-drink text-bg-primary',
  stove: 'bg-station-stove text-bg-primary',
}

const stationLabels = {
  cutting_board: 'Cutting Board',
  fry_station: 'Fry Station',
  drink_station: 'Drink Station',
  stove: 'Stove',
}

export default function Badge({ station, className = '' }: BadgeProps) {
  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full
      ${stationColors[station]} ${className}
    `}>
      {stationLabels[station]}
    </span>
  )
}
