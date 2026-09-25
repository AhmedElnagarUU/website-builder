"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { TUTORIAL_STEPS } from "../lib/tutorialSteps";
import type { TutorialStepKey } from "../types";

interface TutorialState {
  isActive: boolean;
  currentStep: TutorialStepKey;
  completed: boolean;
  dismissed: boolean;
  startTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTutorial: () => void;
  finishTutorial: () => void;
  goToStep: (key: TutorialStepKey) => void;
}

const TutorialContext = createContext<TutorialState | null>(null);

const STORAGE_KEY = "monomastic:tutorial:completed";

function loadCompleted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function saveCompleted(v: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(v));
  } catch {
    // noop
  }
}

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setCompleted(loadCompleted());
  }, []);
  const [currentStep, setCurrentStep] = useState<TutorialStepKey>("dashboard");

  useEffect(() => {
    // If user never saw tutorial and has sites, still offer it on first visit
    // The launcher decides whether to show based on completion state.
  }, []);

  const startTutorial = useCallback(() => {
    setCurrentStep("dashboard");
    setIsActive(true);
  }, []);

  const finishTutorial = useCallback(() => {
    setIsActive(false);
    setCompleted(true);
    saveCompleted(true);
  }, []);

  const nextStep = useCallback(() => {
    const idx = TUTORIAL_STEPS.findIndex((s) => s.key === currentStep);
    if (idx < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(TUTORIAL_STEPS[idx + 1].key);
    } else {
      finishTutorial();
    }
  }, [currentStep, finishTutorial]);

  const prevStep = useCallback(() => {
    const idx = TUTORIAL_STEPS.findIndex((s) => s.key === currentStep);
    if (idx > 0) {
      setCurrentStep(TUTORIAL_STEPS[idx - 1].key);
    }
  }, [currentStep]);

  const skipTutorial = useCallback(() => {
    setIsActive(false);
    setCompleted(true);
    saveCompleted(true);
  }, []);

  const goToStep = useCallback((key: TutorialStepKey) => {
    setCurrentStep(key);
    setIsActive(true);
  }, []);

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        currentStep,
        completed,
        dismissed: completed,
        startTutorial,
        nextStep,
        prevStep,
        skipTutorial,
        finishTutorial,
        goToStep,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial(): TutorialState {
  const ctx = useContext(TutorialContext);
  if (!ctx) {
    throw new Error("useTutorial must be used within TutorialProvider");
  }
  return ctx;
}