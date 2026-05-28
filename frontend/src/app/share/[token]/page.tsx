import SharedPaperView from '@/components/output/SharedPaperView'

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  return <SharedPaperView token={token} />
}
