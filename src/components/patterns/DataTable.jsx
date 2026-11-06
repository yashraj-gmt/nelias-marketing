import { cn } from "@/lib/cn";

/**
 * Shared accessible data table with keyboard-focusable scroll wrapper.
 *
 * @param {Object} props
 * @param {string} props.labelledBy - ID of the heading labelling this table region
 * @param {Array<import("react").ReactNode>} props.head - Column header nodes or strings
 * @param {Array<Array<import("react").ReactNode>>} props.rows - Row cells (strings or nodes)
 * @param {boolean} [props.rowHeaders=true] - Whether the first cell of each body row is a row header (<th scope="row">)
 * @param {number} [props.highlightColumn] - Optional column index to visually highlight (e.g. recommended plan)
 * @param {string} [props.minWidth="min-w-[40rem]"] - Tailwind min-w-* class ensuring minimum table width before scroll
 * @param {string} [props.className]
 */
export function DataTable({
  labelledBy,
  head = [],
  rows = [],
  rowHeaders = true,
  highlightColumn,
  minWidth = "min-w-[40rem]",
  className,
}) {
  return (
    <div
      role="region"
      aria-labelledby={labelledBy}
      tabIndex={0}
      className={cn(
        "mt-6 overflow-x-auto rounded-lg border border-line focus-visible:outline-2 focus-visible:outline-focus",
        className,
      )}
    >
      <table className={cn("w-full border-collapse text-left text-sm md:text-base", minWidth)}>
        <thead>
          <tr className="bg-surface-muted">
            {head.map((col, idx) => {
              const isHighlight = highlightColumn === idx;
              // If rowHeaders is true and top-left header cell is empty, render an empty <td>
              if (rowHeaders && idx === 0 && (!col || col === "")) {
                return <td key={idx} className="border-b border-line px-4 py-3 align-top" />;
              }
              return (
                <th
                  key={idx}
                  scope="col"
                  className={cn(
                    "border-b border-line px-4 py-3 align-top font-semibold [overflow-wrap:anywhere] text-heading",
                    isHighlight && "bg-surface-tint",
                  )}
                >
                  {col}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, colIdx) => {
                const isHighlight = highlightColumn === colIdx;
                if (rowHeaders && colIdx === 0) {
                  return (
                    <th
                      key={colIdx}
                      scope="row"
                      className={cn(
                        "border-t border-line px-4 py-3 text-left align-top font-semibold [overflow-wrap:anywhere] text-heading",
                        isHighlight && "bg-surface-tint",
                      )}
                    >
                      {cell}
                    </th>
                  );
                }
                return (
                  <td
                    key={colIdx}
                    className={cn(
                      "border-t border-line px-4 py-3 align-top [overflow-wrap:anywhere] text-fg",
                      isHighlight && "bg-surface-tint",
                    )}
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
