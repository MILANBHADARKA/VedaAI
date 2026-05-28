import AssignmentOutput from '@/components/output/AssignmentOutput'

export default async function AssignmentOutputPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <AssignmentOutput id={id} />
}
