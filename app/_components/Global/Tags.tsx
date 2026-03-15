// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Tag } from "@/types/post";
// import { X } from "lucide-react";

// type TagsProps = {
//   tags: Tag[];
//   onRemove?: (tag: Tag) => void;
// };

// const Tags = ({ tags, onRemove }: TagsProps) => {
//   return (
//     <>
//       {tags.map((tag) => (
//         <Tooltip key={tag.id}>
//           <TooltipTrigger
//             key={tag.id}
//             className="absolute"
//             style={{
//               left: `${tag.x}%`,
//               top: `${tag.y}%`,
//             }}
//             asChild
//           >
//             <div className="size-0"></div>
//           </TooltipTrigger>
//           <TooltipContent className="text-xs text-white bg-accent p-2 rounded flex gap-2">
//             {tag.username}
//             {onRemove && (
//               <>
//                 {" "}
//                 <X
//                   className="cursor-pointer"
//                   size={15}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onRemove(tag);
//                   }}
//                 />
//               </>
//             )}
//           </TooltipContent>
//         </Tooltip>
//       ))}
//     </>
//   );
// };

// export default Tags;
