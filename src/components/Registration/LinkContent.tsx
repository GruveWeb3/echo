import React from "react";

const LinkedContent = ({
  content,
  themeColor,
}: {
  content: string;
  themeColor: string;
}) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);

  return (
    <span>
      {parts.map((part, index) =>
        urlRegex.test(part) ? (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: themeColor ? themeColor : "#EA445A",
              textDecoration: "underline",
              wordBreak: "break-all",
              overflowWrap: "anywhere",
            }}
          >
            {part}
          </a>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

export default LinkedContent;
