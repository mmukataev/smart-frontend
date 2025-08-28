import Link from "next/link";
import Systems from "@/translations/systems";
import LogoutButton from '@/components/LogoutButton';


export default function LeftBar() {

 

  return (
    <div className="flex flex-col justify-between p-[10px] bg-white w-[250px] h-fill rounded-[5px] shadow">
      <nav className="flex flex-col space-y-2">
        {Object.entries(Systems).map(([id, system]) => (
          <Link
            key={id}
            href={system.url}
            className="flex items-center gap-2 hover:shadow"
          >
            <div className="flex items-center justify-center w-[50px] h-[50px] bg-[#F9F9F9] rounded-[5px]">
                <img src={`/icons${system.icon}`} alt={system.name.ru} className="w-[24px] h-[24px]" />
            </div>
            <b className="text-[#A0A0A0] text-[12px]">{system.name.ru}</b>

            
          </Link>
          
        ))}
      </nav>

    <LogoutButton />
    </div>
  );
}
