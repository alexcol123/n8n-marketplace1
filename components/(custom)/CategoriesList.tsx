import Link from "next/link";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { technologyCategories } from "@/utils/constants";
import { GrAddCircle } from "react-icons/gr";

interface CategoriesListProps {
  category?: string;
  search?: string;
}

const CategoriesList = ({ category, search }: CategoriesListProps) => {
  // Create search term query parameter once, only when search changes
  const searchTerm = search ? `&search=${search}` : "";


  const categoryPresent = category !== undefined ? true : false;

  return (
    <ScrollArea className="py-6">
      <div className="flex gap-x-4 ml-4 pb-2">
        <Link
          href={`/`}
          className={`
            px-4 py-2 rounded-full text-sm font-medium 
            transition-colors duration-200 ease-in-out
            ${
              !categoryPresent
                ? "bg-primary/80 text-primary-foreground hover:bg-primary/60"
                : "bg-primary/10 text-primary hover:bg-primary/30 border-primary border-2"
            }
          `}
        >
          <div className="flex items-center gap-2 whitespace-nowrap">
            View All
            <GrAddCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          </div>
        </Link>

        {technologyCategories.map((cat) => {
          const isActive = category === cat.label;
          const categoryLabel =
            cat.label.charAt(0).toUpperCase() + cat.label.slice(1);

          return (
            <Link
              key={cat.label}
              href={`/?category=${cat.label}${searchTerm}`}
              className={`
                px-4 py-2 rounded-full text-sm font-medium 
                transition-colors duration-200 ease-in-out
                ${
                  isActive
                    ? "bg-primary/80 text-primary-foreground hover:bg-primary/60"
                    : "bg-primary/10 text-primary hover:bg-primary/30"
                }
              `}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="flex items-center gap-2 whitespace-nowrap">
                {categoryLabel}
                <cat.icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              </div>
            </Link>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default CategoriesList;