import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchPanel = () => {
  return (
    <div className="px-5 py-7">
      <h3 className="text-2xl font-bold mb-10">Search</h3>
      <div className="relative">
        <Search className="absolute top-2 left-2.5 text-ring" size={20} />
        <Input
          className="absolute py-3 rounded-full pl-10 text-ring placeholder:text-md"
          placeholder="Search"
        />
      </div>
    </div>
  );
};

export default SearchPanel;
