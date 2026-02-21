import { SPECIALISTS } from "./SpecialistCards";

/** Renders a text block with basic markdown-like formatting */
function FormattedText({ text }) {
  // Split into lines and handle **bold**, *italic*, and bullet lists
  const lines = text.split("\n");

  return (
    <div className="flex flex-col gap-1">
      {lines.map((line, i) => {
        // Empty line → small spacer
        if (!line.trim()) return <div key={i} className="h-1" />;

        // Heading: ### or ## or #
        const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const content = headingMatch[2];
          const cls =
            level === 1
              ? "text-base font-bold text-slate-900 mt-1"
              : level === 2
              ? "text-sm font-bold text-slate-800 mt-1"
              : "text-sm font-semibold text-slate-700 mt-0.5";
          return (
            <p key={i} className={cls}>
              {renderInline(content)}
            </p>
          );
        }

        // Bullet: - or * or •
        const bulletMatch = line.match(/^[\-\*•]\s+(.+)/);
        if (bulletMatch) {
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
              <p className="text-sm leading-relaxed">
                {renderInline(bulletMatch[1])}
              </p>
            </div>
          );
        }

        // Numbered list: 1. 2. etc.
        const numberedMatch = line.match(/^(\d+)\.\s+(.+)/);
        if (numberedMatch) {
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xs font-semibold text-teal-700 shrink-0 mt-0.5 w-4 text-right">
                {numberedMatch[1]}.
              </span>
              <p className="text-sm leading-relaxed">
                {renderInline(numberedMatch[2])}
              </p>
            </div>
          );
        }

        // Normal paragraph
        return (
          <p key={i} className="text-sm leading-relaxed">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}

/** Renders inline bold/italic formatting */
function renderInline(text) {
  // Split on **bold**, *italic*
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[0].startsWith("**")) {
      parts.push(<strong key={match.index}>{match[2]}</strong>);
    } else {
      parts.push(<em key={match.index}>{match[3]}</em>);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length ? parts : text;
}

/** Specialist routing badge shown beneath an AI message */
function RoutingBadge({ specialist }) {
  const spec = SPECIALISTS[specialist];
  if (!spec) return null;
  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${spec.badge}`}
    >
      <span>{spec.icon}</span>
      <span>{spec.label} Advisor</span>
    </div>
  );
}

/** Animated three-dot loader */
function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-slate-400"
          style={{ animation: `blink 1.2s ${i * 0.2}s ease-in-out infinite` }}
        />
      ))}
    </div>
  );
}

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const isThinking = message.thinking === true;

  return (
    <div
      className={`message-enter flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* AI avatar */}
      {!isUser && (
        <div className="flex items-end mr-2 mb-1 shrink-0">
          <div className="w-7 h-7 rounded-full bg-teal-700 flex items-center justify-center text-white text-[11px] font-bold select-none">
            Zx
          </div>
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-teal-700 text-white rounded-br-sm"
              : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm"
          }`}
        >
          {isThinking ? (
            <ThinkingDots />
          ) : isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <div className={message.streaming ? "cursor-blink" : ""}>
              <FormattedText text={message.content || ""} />
            </div>
          )}
        </div>

        {/* Specialist badge + timestamp row */}
        <div className={`flex items-center gap-2 px-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          {message.specialist && !isUser && (
            <RoutingBadge specialist={message.specialist} />
          )}
          {message.timestamp && (
            <span className="text-[10px] text-slate-400">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="flex items-end ml-2 mb-1 shrink-0">
          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-[11px] font-semibold select-none">
            You
          </div>
        </div>
      )}
    </div>
  );
}
