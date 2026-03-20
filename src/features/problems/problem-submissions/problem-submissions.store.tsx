import { Submission } from "@/features/problem/models/submission";
import { Problem } from "../models/problem"
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { create } from "zustand/react";

type ProblemSubmissionsState = {
    problem: Problem | null;
    submissions: Submission[];
}

type ProblemSubmissionsStore = ProblemSubmissionsState;

export const useProblemSubmissionsStore = create<ProblemSubmissionsStore>()(
    subscribeWithSelector(
        devtools((set, get) => ({
            problem: null,
            submissions: [],
            
        }))
    )
)