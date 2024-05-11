import Image from "next/image";

interface Props {
   className: string;
   img: string;
   title: string;
   description: string;
   onClick: () => void;
}


const HomeCard = (props: Props) => {

   return (
      <div
         className={`${props.className} px-4 py-6 flex flex-col justify-between w-full
        xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer`}
         onClick={props.onClick}
      >
         <div className="flex-center glassmorphism size-12 rounded-[10px]">
            <Image src={props.img} alt="meeting" width={27} height={27} />
         </div>
         <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{props.title}</h1>
            <p className="text-lg fon-normal">{props.description}</p>
         </div>
      </div>
   );
};

export default HomeCard;
