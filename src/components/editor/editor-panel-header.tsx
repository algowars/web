import { Button } from "../ui/button";
import { type Tab } from "./editor";

type EditorPanelHeaderProps = {
  tab: Tab;
  currentTabIndex: number;
  setCurrentTab: (index: number) => void;
};

export const EditorPanelHeader = ({
  tab,
  currentTabIndex,
  setCurrentTab,
}: EditorPanelHeaderProps) => {
  if (tab.children) {
    return (
      <nav className="flex items-center gap-1 overflow-x-auto border-b px-2 py-1">
        {tab.children.map((t, index) => (
          <Button
            variant={index === currentTabIndex ? "secondary" : "ghost"}
            className={`h-7 px-3 py-1 ${
              index === currentTabIndex
                ? "text-primary"
                : "text-muted-foreground"
            }`}
            key={t.key}
            onClick={() => setCurrentTab(index)}
          >
            {t && <span className="mr-1">{t.icon}</span>}
            {t.name}
          </Button>
        ))}
      </nav>
    );
  }
  return (
    <nav className="flex items-center gap-5 border-b px-2 py-1">
      <Button variant="ghost" className="h-7 px-3 py-1">
        {tab && <span className="mr-1">{tab.icon}</span>}
        {tab.name}
      </Button>
      {tab?.headerComponent}
    </nav>
  );
};
