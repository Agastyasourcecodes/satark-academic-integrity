import { ExamInterface } from "@/components/exam/exam-interface"

export default function ExamPage({ params }: { params: { id: string } }) {
  return <ExamInterface examId={params.id} />
}
