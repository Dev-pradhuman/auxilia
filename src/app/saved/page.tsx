"use client";

import { AccessibleButton } from "@/components/ui/AccessibleButton";
import { Bookmark, Clock, MapPin, MessageSquare, Search } from "lucide-react";

export default function SavedPage() {
  const savedItems = [
    { id: 1, type: 'phrase', title: 'Translation', content: 'Where is the accessible entrance?', icon: MessageSquare },
    { id: 2, type: 'location', title: 'Saved Place', content: 'Central Library Main Desk', icon: MapPin },
    { id: 3, type: 'document', title: 'Scanned Document', content: 'Clinic instructions (Simplified)', icon: Bookmark },
  ];

  return (
    <div className="flex flex-col px-6 pt-12 pb-24 max-w-2xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Saved Items</h1>
        <p className="text-xl text-muted-foreground font-medium">Your important information, ready when you need it.</p>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={24} />
        <input 
          type="text" 
          placeholder="Search saved items..." 
          className="w-full h-16 pl-12 pr-4 rounded-2xl border-2 border-border bg-card text-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary"
        />
      </div>

      <div className="space-y-4">
        {savedItems.map((item) => (
          <div key={item.id} className="bg-card border-2 border-border rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3 text-muted-foreground">
              <item.icon size={20} />
              <span className="font-semibold uppercase tracking-wider text-sm">{item.title}</span>
              <div className="flex-1" />
              <Clock size={16} />
              <span className="text-sm">Recently</span>
            </div>
            <p className="text-2xl font-medium leading-relaxed">{item.content}</p>
            <div className="flex gap-2 mt-2">
              <AccessibleButton variant="secondary" size="sm" className="flex-1">View</AccessibleButton>
              <AccessibleButton variant="secondary" size="sm" className="flex-1">Read Aloud</AccessibleButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
