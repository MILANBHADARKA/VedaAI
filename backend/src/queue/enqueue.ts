type EnqueueInput = {
  assignmentId: string
  jobId: string
}

export async function enqueueGeneration(input: EnqueueInput): Promise<string> {
  console.log('[queue] (stub) would enqueue generation', input)
  return input.jobId
}
