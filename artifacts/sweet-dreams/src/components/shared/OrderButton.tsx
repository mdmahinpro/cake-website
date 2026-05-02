import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import { useStore } from "../../store/useStore";
import { openOrderChannel } from "../../utils/order";

type Size = "sm" | "md" | "lg";

interface OrderButtonProps {
  caption: string;
  category?: string;
  size?: Size;
  className?: string;
}

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs gap-1",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
};

const iconSize: Record<Size, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

const labelText: Record<Size, string> = {
  sm: "Order",
  md: "Order This Cake",
  lg: "Order This Cake",
};

export default function OrderButton({
  caption,
  category,
  size = "md",
  className = "",
}: OrderButtonProps) {
  const { state } = useStore();
  const { settings } = state;

  const Icon =
    settings.orderChannel === "whatsapp" ? FaWhatsapp : FaFacebook;

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    openOrderChannel(settings, caption, category);
  }

  return (
    <button
      onClick={handleClick}
      className={`btn-primary flex items-center justify-center rounded-full ${sizeStyles[size]} ${className}`}
    >
      <Icon size={iconSize[size]} />
      <span>{labelText[size]}</span>
    </button>
  );
}
