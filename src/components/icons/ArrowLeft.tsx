export const ArrowLeftIcon = ({
  className,
  fill,
}: {
  className?: string;
  fill?: string;
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={fill ?? "none"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.5 12H6" stroke={fill ?? "#181818"} stroke-width="2" />
      <path
        d="M12 6L6 12L12 18"
        stroke={fill ?? "#181818"}
        stroke-width="2"
        stroke-linecap="square"
      />
    </svg>
  );
};
