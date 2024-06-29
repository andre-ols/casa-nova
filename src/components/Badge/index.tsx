import { FC } from "react";

export const Badge: FC<{
  type: "success" | "danger" | "warning" | "info" | "default";
  text: string;
}> = ({ text, type }) => {
  return (
    <span
      className={`px-3 py-1 text-xs text-black font-bold rounded-lg w-fit h-fit ${
        type === "danger"
          ? "bg-red-500"
          : type === "info"
          ? "bg-blue-500"
          : type === "success"
          ? "bg-green-400"
          : type === "warning"
          ? "bg-yellow-400"
          : "bg-zinc-300"
      }`}
    >
      {text}
    </span>
  );
};
