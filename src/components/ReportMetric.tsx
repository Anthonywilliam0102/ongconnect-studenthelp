interface ReportMetricProps {
  label: string;
  value: string | number;
  helper?: string;
}

export function ReportMetric({ label, value, helper }: ReportMetricProps) {
  return (
    <article className="report-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      {helper ? <small>{helper}</small> : null}
    </article>
  );
}
