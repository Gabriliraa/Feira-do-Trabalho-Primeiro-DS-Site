"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { LessonContent } from "./lesson-content"
import { HTMLEditor, HTMLPreview } from "./html-editor"
import { Code, Eye, Settings, Search, GitBranch, Bug, Package, Folder, FolderOpen } from "lucide-react"

interface VSCodeLayoutProps {
  lessonId: number
  expectedOutput: string
  initialCode?: string
}

export function VSCodeLayout({ lessonId, expectedOutput, initialCode }: VSCodeLayoutProps) {
  const [activeTab, setActiveTab] = useState("lesson")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const sidebarItems = [
    { id: "files", icon: Folder, label: "Explorer" },
    { id: "search", icon: Search, label: "Search" },
    { id: "git", icon: GitBranch, label: "Source Control" },
    { id: "debug", icon: Bug, label: "Run and Debug" },
    { id: "extensions", icon: Package, label: "Extensions" },
  ]

  return (
    <div className="h-full bg-slate-900 text-slate-100 flex flex-col">
      {/* VSCode-style Activity Bar */}
      <div className="flex h-full">
        <div className="w-12 bg-slate-800 flex flex-col items-center py-2 space-y-1">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className="w-10 h-10 p-0 text-slate-400 hover:text-slate-100 hover:bg-slate-700"
              onClick={() => {
                setActiveTab(item.id)
                setSidebarCollapsed(false)
              }}
            >
              <item.icon className="w-5 h-5" />
            </Button>
          ))}
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 p-0 text-slate-400 hover:text-slate-100 hover:bg-slate-700"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Sidebar Panel */}
            {!sidebarCollapsed && (
              <>
                <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                  <div className="h-full bg-slate-850 border-r border-slate-700">
                    {/* Sidebar Header */}
                    <div className="h-8 bg-slate-800 border-b border-slate-700 flex items-center px-3">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="w-4 h-4" />
                        <span className="text-sm font-medium">LIÇÃO {lessonId}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto w-6 h-6 p-0 text-slate-400 hover:text-slate-100"
                        onClick={() => setSidebarCollapsed(true)}
                      >
                        ×
                      </Button>
                    </div>

                    {/* Sidebar Content */}
                    <div className="h-[calc(100%-2rem)] bg-slate-900">
                      <LessonContent lessonId={lessonId} />
                    </div>
                  </div>
                </ResizablePanel>
                <ResizableHandle className="w-1 bg-slate-700 hover:bg-slate-600" />
              </>
            )}

            {/* Editor Panel */}
            <ResizablePanel defaultSize={sidebarCollapsed ? 60 : 45} minSize={30}>
              <div className="h-full bg-slate-900 flex flex-col">
                {/* Tab Bar */}
                <div className="h-8 bg-slate-800 border-b border-slate-700 flex items-center px-2">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border-t-2 border-blue-500 text-sm">
                      <Code className="w-3 h-3" />
                      <span>index.html</span>
                    </div>
                  </div>
                </div>

                {/* Editor Content */}
                <div className="flex-1">
                  <HTMLEditor lessonId={lessonId} expectedOutput={expectedOutput} initialCode={initialCode} />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle className="w-1 bg-slate-700 hover:bg-slate-600" />

            {/* Preview Panel */}
            <ResizablePanel defaultSize={30} minSize={25}>
              <div className="h-full bg-white flex flex-col">
                {/* Preview Header */}
                <div className="h-8 bg-slate-800 border-b border-slate-700 flex items-center px-3">
                  <div className="flex items-center gap-2 text-slate-100">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">PREVIEW</span>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 bg-white">
                  <HTMLPreview />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  )
}
