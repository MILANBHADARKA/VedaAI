import { renderToBuffer } from '@react-pdf/renderer'
import { PaperDocument, type PaperData } from './PaperDocument'

export async function renderPaperPdf(paper: PaperData): Promise<Buffer> {
  return renderToBuffer(<PaperDocument paper={paper} />)
}
