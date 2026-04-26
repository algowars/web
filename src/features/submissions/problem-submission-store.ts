import { Submission } from "../problem/models/submission";
import { Problem } from "../problems/models/problem"

type ProblemSubmissionState = {
    problem: Problem | null;
    submissions: Submission[];
}

type ProblemSubmissionActions = {
    loadProblem: (problem: Problem) => void;
    loadProblemSuccess: 
}