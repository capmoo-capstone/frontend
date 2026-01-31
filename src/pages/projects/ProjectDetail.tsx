import { useParams } from "react-router-dom";

export default function ProjectDetail() {
  const { id } = useParams();
  if (!id) return null;

  return <div>Project Detail Page</div>;
}
