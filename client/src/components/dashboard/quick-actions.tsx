import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Globe, FolderOpen, ChevronRight } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Create Template",
      icon: Plus,
      iconBg: "bg-blue-100",
      iconColor: "text-primary",
      onClick: () => {
        // TODO: Open template creation modal
        console.log("Create template");
      }
    },
    {
      title: "Add Language",
      icon: Globe,
      iconBg: "bg-green-100", 
      iconColor: "text-secondary",
      onClick: () => {
        // TODO: Navigate to languages page
        console.log("Add language");
      }
    },
    {
      title: "Manage Categories",
      icon: FolderOpen,
      iconBg: "bg-yellow-100",
      iconColor: "text-accent",
      onClick: () => {
        // TODO: Navigate to categories page
        console.log("Manage categories");
      }
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.title}
              variant="ghost"
              className="w-full justify-between p-3 h-auto border border-gray-200 hover:bg-gray-50"
              onClick={action.onClick}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${action.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${action.iconColor}`} />
                </div>
                <span className="text-sm font-medium text-gray-900">{action.title}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
