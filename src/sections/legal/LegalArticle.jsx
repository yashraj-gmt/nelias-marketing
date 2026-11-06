import { cn } from "@/lib/cn";
import { Linkified } from "@/components/legal/Linkified.jsx";

/**
 * Renders a single numbered legal article with semantic section, h2, and blocks (p, ul, table).
 *
 * @param {object} props
 * @param {number} props.index - 0-based index
 * @param {{ title: string, blocks: Array<{ p?: string, ul?: string[], table?: { head: string[], rows: string[][] } }> }} props.article
 */
export function LegalArticle({ index, article }) {
  const articleId = `article-${index + 1}`;
  const titleId = `${articleId}-title`;

  return (
    <section
      id={articleId}
      aria-labelledby={titleId}
      className="mt-10 scroll-mt-28 border-t border-line pt-8 first:mt-0 first:border-t-0 first:pt-0"
    >
      <h2 id={titleId} className="font-display text-h3 font-semibold text-heading">
        <Linkified text={article.title} />
      </h2>

      {article.blocks?.map((block, bIdx) => {
        if (block.p !== undefined) {
          return (
            <p
              key={bIdx}
              className="mt-4 text-[1.0625rem] leading-7 [overflow-wrap:anywhere] text-fg"
            >
              <Linkified text={block.p} />
            </p>
          );
        }

        if (Array.isArray(block.ul)) {
          return (
            <ul
              key={bIdx}
              className="mt-4 list-disc space-y-2 pl-6 text-[1.0625rem] leading-7 [overflow-wrap:anywhere] text-fg marker:text-accent"
            >
              {block.ul.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <Linkified text={item} />
                </li>
              ))}
            </ul>
          );
        }

        if (block.table && Array.isArray(block.table.head) && Array.isArray(block.table.rows)) {
          const isMultiCol = block.table.head.length > 2;
          return (
            <div
              key={bIdx}
              role="region"
              aria-labelledby={titleId}
              tabIndex={0}
              className="mt-4 overflow-x-auto rounded-lg border border-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <table
                className={cn(
                  "w-full border-collapse text-left text-[1.0625rem] leading-7",
                  isMultiCol && "min-w-[36rem]",
                )}
              >
                <thead>
                  <tr>
                    {block.table.head.map((col, colIdx) => (
                      <th
                        key={colIdx}
                        scope="col"
                        className={cn(
                          "bg-surface-muted font-semibold text-heading",
                          isMultiCol ? "px-3 py-3" : "px-4 py-3",
                        )}
                      >
                        <Linkified text={col} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.table.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <th
                        scope="row"
                        className={cn(
                          "border-t border-line align-top font-semibold [overflow-wrap:anywhere] text-heading",
                          isMultiCol ? "min-w-[9rem] px-3 py-3" : "w-2/5 px-4 py-3",
                        )}
                      >
                        <Linkified text={row[0]} />
                      </th>
                      {row.slice(1).map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={cn(
                            "border-t border-line align-top [overflow-wrap:anywhere] text-fg",
                            isMultiCol ? "px-3 py-3" : "px-4 py-3",
                          )}
                        >
                          <Linkified text={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return null;
      })}
    </section>
  );
}
