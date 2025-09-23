"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdminProblemOverview from "../admin-problem-overview/admin-problem-overview";

export default function AdminProblemTabs() {
  return (
    <Tabs defaultValue="overview" className="w-full gap-4">
      <TabsList className="w-full">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="test-suite">Test Suites</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <AdminProblemOverview />
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
