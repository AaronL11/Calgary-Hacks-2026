import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";

type Props = {
    content: string;
};

export default function MarkdownRenderer({ content }: Props) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
        >
            {content}
        </ReactMarkdown>
    );
}