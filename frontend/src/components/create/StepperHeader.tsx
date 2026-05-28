export default function StepperHeader() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-success" />
        <h1 className="text-lg font-semibold text-neutral-900">
          Create Assignment
        </h1>
      </div>
      <p className="text-sm text-neutral-600 mt-1">
        Set up a new assignment for your students.
      </p>
      <div className="mt-4 h-[3px] w-full rounded-full bg-neutral-300 overflow-hidden">
        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-neutral-900 to-neutral-400" />
      </div>
    </div>
  )
}
