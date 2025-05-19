import { Typography } from "@worldcoin/mini-apps-ui-kit-react";

export const EmptyComponent = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col justify-center items-center gap-3 text-center h-[calc(100vh-200px)]">
      <div className="bg-gray-400 h-20 w-20 rounded-full mx-auto flex items-center justify-center">
        {icon}
      </div>
      <Typography className="text-gray-900" variant="heading" level={1}>
        {title}
      </Typography>
      <Typography className="text-gray-500" variant="body" level={2}>
        {description}
      </Typography>
    </div>
  );
};
