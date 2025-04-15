// DisplayTechIcons.tsx
import Image from "next/image";
import { cn, getTechLogos } from "@/lib/utils";

const DisplayTechIcons = async ({ techStack }: TechIconProps) => {
  const techIcons = await getTechLogos(techStack);

  return (
    <div className="flex items-center -space-x-3">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-gray-100 dark:bg-gray-700 rounded-full p-2 transition-all duration-300 hover:scale-110 hover:z-10",
            "shadow-sm hover:shadow-md"
          )}
        >
          {/* Tooltip */}
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            {tech}
          </span>

          <Image
            src={url}
            alt={tech}
            width={24}
            height={24}
            className="w-6 h-6 object-contain transition-transform duration-300 group-hover:scale-125"
          />
        </div>
      ))}
      {techIcons.length > 3 && (
        <div className="relative bg-gray-100 dark:bg-gray-700 rounded-full p-2 text-gray-600 dark:text-gray-300 text-xs font-semibold transition-all duration-300 hover:scale-110">
          +{techIcons.length - 3}
        </div>
      )}
    </div>
  );
};

export default DisplayTechIcons;