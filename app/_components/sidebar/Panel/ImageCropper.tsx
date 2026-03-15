// "use client";

// import { cn } from "@/lib/utils";
// import {
//   Image as ImageIcon,
//   Maximize,
//   RectangleHorizontal,
//   RectangleVertical,
//   Square,
//   ZoomIn,
// } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Slider } from "@/components/ui/slider";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// export type PreviewUrlProp = {
//   previewUrl: string | null;
// };

// type Aspect = "original" | "1/1" | "4/5" | "16/9";

// const ImageCropper = ({ previewUrl }: PreviewUrlProp) => {
//   const imageRef = useRef<HTMLDivElement>(null);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [scale, setScale] = useState(1);
//   const [isDragging, setIsDragging] = useState(false);
//   const dragStart = useRef({ x: 0, y: 0 });
//   const [aspect, setAspect] = useState<Aspect>("original");
//   const [originalAspect, setOriginalAspect] = useState<string | undefined>();

//   useEffect(() => {
//     if (!previewUrl) return;
//     const img = new Image();

//     img.src = previewUrl;

//     img.onload = () => {
//       setOriginalAspect(`${img.naturalWidth} / ${img.naturalHeight}`);
//     };
//   }, [previewUrl]);

//   const handleMouseDown = (e: React.MouseEvent) => {
//     setIsDragging(true);
//     dragStart.current = {
//       x: e.clientX - position.x,
//       y: e.clientY - position.y,
//     };
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!isDragging) return;

//     setPosition({
//       x: e.clientX - dragStart.current.x,
//       y: e.clientY - dragStart.current.y,
//     });
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   const handleAspectRatio = (aspect: Aspect) => {
//     if (aspect === "original") return originalAspect;
//     else if (aspect === "1/1") return "1 / 1";
//     else if (aspect === "4/5") return "4 / 5";
//     else if (aspect === "16/9") return "16 / 9";
//   };

//   return (
//     <div>
//       {/*crop-area*/}
//       <div
//         className="w-full h-130 overflow-hidden flex items-center justify-center relative"
//         onMouseMove={handleMouseMove}
//         onMouseLeave={handleMouseUp}
//         onMouseUp={handleMouseUp}
//       >
//         {/*image-layer*/}
//         <div
//           className={cn(
//             "w-full cursor-grab active:cursor-grabbing bg-no-repeat "
//           )}
//           style={{
//             backgroundImage: `url(${previewUrl})`,
//             backgroundSize: "contain",
//             backgroundPosition: "center",
//             transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
//             aspectRatio: handleAspectRatio(aspect),
//           }}
//           onMouseDown={handleMouseDown}
//           ref={imageRef}
//         ></div>

//         <div className="absolute left-0 bottom-0 flex items-center">
//           <DropdownMenu modal={false}>
//             <DropdownMenuTrigger asChild>
//               <Maximize className="ml-5 mb-5" size={25} />
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               <DropdownMenuItem
//                 className="flex gap-2 cursor-pointer"
//                 onClick={() => setAspect("original")}
//               >
//                 Original
//                 <ImageIcon size={20} />
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 className="cursor-pointer"
//                 onClick={() => setAspect("1/1")}
//               >
//                 1:1
//                 <Square />
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 className="cursor-pointer"
//                 onClick={() => setAspect("4/5")}
//               >
//                 4:5
//                 <RectangleVertical />
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 className="cursor-pointer"
//                 onClick={() => setAspect("16/9")}
//               >
//                 16:9
//                 <RectangleHorizontal />
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>

//           <Popover modal={false}>
//             <PopoverTrigger asChild>
//               <ZoomIn className="ml-5 mb-5" size={25} />
//             </PopoverTrigger>
//             <PopoverContent
//               side="top"
//               align="start"
//               sideOffset={10}
//               className="flex justify-center items-center w-44"
//             >
//               <Slider
//                 defaultValue={[2]}
//                 min={1}
//                 max={3}
//                 step={0.01}
//                 value={[scale]}
//                 onValueChange={(value) => setScale(value[0])}
//                 className="absolute w-40"
//               />
//             </PopoverContent>
//           </Popover>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImageCropper;
