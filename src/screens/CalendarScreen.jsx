import { ALL_DAYS } from '../data/workouts'

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatDate(isoString) {
  if (!isoString) return null
  const d = new Date(isoString)
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`
}

export default function CalendarScreen({ isWorkoutComplete, log, onBack }) {
  const totalCompleted = ALL_DAYS.filter(d => isWorkoutComplete(d.id)).length
  const totalRemaining = ALL_DAYS.length - totalCompleted

  // Find the first completed workout to get start date
  let startDate = null
  for (const day of ALL_DAYS) {
    const wLog = log[`workout_${day.id}`]
    if (wLog?.completedAt) {
      if (!startDate || new Date(wLog.completedAt) < new Date(startDate)) {
        startDate = wLog.completedAt
      }
    }
  }

  // Calculate streak: count consecutive completed days from the most recent backwards
  let streak = 0
  const completedDays = ALL_DAYS.filter(d => isWorkoutComplete(d.id))
  if (completedDays.length > 0) {
    // Simple streak = consecutive completed workouts counting from end
    for (let i = ALL_DAYS.length - 1; i >= 0; i--) {
      if (isWorkoutComplete(ALL_DAYS[i].id)) streak++
      else break
    }
  }

  // Find the index of the current (next uncompleted) day
  const currentDayIdx = ALL_DAYS.findIndex(d => !isWorkoutComplete(d.id))

  return (
    <div className="flex flex-col h-full bg-gray-950 text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-gray-400 active:text-white py-1 px-2 text-base"
        >
          <span className="text-2xl leading-none">‹</span>
          <span>Back</span>
        </button>
        <h1 className="text-xl font-bold text-white">Progress</h1>
        <div className="w-16" />
      </div>

      {/* Streak counter */}
      <div className="flex items-center justify-center py-4 bg-gray-900 border-b border-gray-800 flex-shrink-0">
        <span className="text-2xl font-bold text-orange-400">🔥 {streak} day streak</span>
      </div>

      {/* Calendar grid — 6 rows × 3 columns */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {ALL_DAYS.map((dayData, idx) => {
            const completed = isWorkoutComplete(dayData.id)
            const isCurrent = idx === currentDayIdx
            const wLog = log[`workout_${dayData.id}`]
            const completedAt = wLog?.completedAt ? formatDate(wLog.completedAt) : null
            const exerciseCount = dayData.exercises.length

            let borderColor = 'border-gray-800'
            let bgColor = 'bg-gray-900'
            let statusIcon = null

            if (completed) {
              borderColor = 'border-green-700'
              bgColor = 'bg-green-950'
              statusIcon = <span className="text-xl">✅</span>
            } else if (isCurrent) {
              borderColor = 'border-red-600'
              bgColor = 'bg-gray-900'
              statusIcon = <span className="text-xl text-red-500">●</span>
            } else {
              statusIcon = <span className="w-5 h-5 rounded-full border-2 border-gray-600 inline-block" />
            }

            return (
              <div
                key={dayData.id}
                className={`rounded-2xl border ${borderColor} ${bgColor} p-3 flex flex-col gap-1`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    W{dayData.week} D{dayData.day}
                  </span>
                  {statusIcon}
                </div>
                {completedAt ? (
                  <span className="text-xs text-green-400 font-semibold">{completedAt}</span>
                ) : isCurrent ? (
                  <span className="text-xs text-red-400 font-semibold">Current</span>
                ) : (
                  <span className="text-xs text-gray-600">Upcoming</span>
                )}
                <span className="text-xs text-gray-500">{exerciseCount} exercises</span>
              </div>
            )
          })}
        </div>

        {/* Stats section */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 mb-6">
          <h2 className="text-base font-bold text-white mb-4 uppercase tracking-wide">Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Total completed</span>
              <span className="text-green-400 font-bold text-lg">{totalCompleted}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Total remaining</span>
              <span className="text-red-400 font-bold text-lg">{totalRemaining}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Total workouts</span>
              <span className="text-white font-bold text-lg">{ALL_DAYS.length}</span>
            </div>
            {startDate && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Start date</span>
                <span className="text-white font-semibold text-sm">{formatDate(startDate)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
