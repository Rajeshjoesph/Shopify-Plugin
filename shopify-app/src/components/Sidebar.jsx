import { BehaviorTab } from "./behavior-tab";
import { DesignTab } from "./design-tab";
import  { AppConfig, SocialIcon, DesignSettings } from "@shared/schema";

// interface SidebarProps {
//   config?: AppConfig;
//   icons: SocialIcon[];
//   activeTab: "behavior" | "design";
//   setActiveTab: (tab: "behavior" | "design") => void;
//   onAddIcon: () => void;
//   designSettings?: DesignSettings;
// }

export function Sidebar({ 
  config, 
  icons, 
  activeTab, 
  setActiveTab, 
  onAddIcon,
  designSettings 
}) {
  return (
    <aside className="w-full bg-white rounded-xl shadow-lg flex flex-col min-h-0">
      <div className="p-4 sm:p-6 flex flex-col min-h-0 flex-1">
        {/* Tab Navigation */}
        <div className="border-b border-[hsl(240,3.7%,15.9%)] mb-6 flex-shrink-0">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("behavior")}
              className={`px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors flex-1 flex flex-col sm:flex-row items-center justify-center sm:justify-start ${
                activeTab === "behavior"
                  ? "text-[#42794a] border-[#42794a] bg-green-50"
                  : "text-[hsl(240,5%,64.9%)] border-transparent hover:text-[hsl(240,10%,3.9%)]"
              }`}
            >
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                <span>Behaviour</span>
                <span className="px-1 sm:px-2 py-0.5 bg-[#42794a] text-white text-[8px] sm:text-xs rounded-full min-w-[12px] h-[12px] sm:min-w-[18px] sm:h-[18px] flex items-center justify-center">
                  {icons.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("design")}
              className={`px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors flex-1 ${
                activeTab === "design"
                  ? "text-[#42794a] border-[#42794a] bg-green-50"
                  : "text-[hsl(240,5%,64.9%)] border-transparent hover:text-[hsl(240,10%,3.9%)]"
              }`}
            >
              Design
            </button>
          </nav>
        </div>

        {/* Tab Content - Scrollable area */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {activeTab === "behavior" ? (
            <BehaviorTab icons={icons} onAddIcon={onAddIcon} />
          ) : (
            <DesignTab designSettings={designSettings} />
          )}
        </div>
      </div>
    </aside>
  );
}
