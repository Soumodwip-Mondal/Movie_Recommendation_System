import { Menu,SearchIcon, UserCircleIcon,} from "lucide-react";
import AvatarIcon from "../ui/Avater";
export default function Header() {
  return (
      <header className="h-14 md:h-16 fixed top-0 left-0 w-full z-50 bg-primary/60 backdrop-blur-xl border-b border-white/10 ">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center h-16">
        {/* Logo */}
         <nav className="hidden md:flex items-center gap-8 text-gray-300">
           <h1 className="text-2xl font-bold tracking-tight">
          🎬 <span className="text-accent">MovieVerse</span>
          </h1>
         
          <a href="#" className="hover:text-white text-sm font-medium transition-colors">
            Home
          </a>
          <a href="#" className="hover:text-white text-sm font-medium transition-colors">
            Genres
          </a>
          <a href="#" className="hover:text-white text-sm font-medium transition-colors">
            Top Rated
          </a>
          <a href="#" className="hover:text-white text-sm font-medium transition-colors">
            About
          </a>
          <a href="#" className="hover:text-white text-sm font-medium transition-colors">
            My List
          </a>
        </nav>
         <div className="flex gap-16 text-white/70 ">
         <h1 className="flex items-center md:hidden text-2xl font-bold tracking-tight">
          🎬 <span className="text-accent">MovieVerse</span>
          </h1>
             <div className=" flex text-sm font-medium transition-colors gap-2">
              <SearchIcon className="w-6 h-6"/>
              <p>Search</p>
             </div>
            <div className="hidden text-sm font-medium transition-colors md:flex gap-2">
                <UserCircleIcon/>My space
              </div>
         </div>
        {/* Desktop Nav */}
       
      </div>
    </header>
  );
}

