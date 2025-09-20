"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function AdminProblemTabs() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="test-suite">Test Suite</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div>Overview content</div>
      </TabsContent>
      <TabsContent value="test-suite">
        <div>Test Suite content</div>
      </TabsContent>
      <TabsContent value="activity">
        <div>Activity content</div>
      </TabsContent>
    </Tabs>
  );
}
