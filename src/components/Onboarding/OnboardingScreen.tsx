import React, { useState } from 'react';

interface OnboardingStep {
  title: string;
  description: string;
}

const STEPS: OnboardingStep[] = [
  {
    title: 'Welcome to Life Blueprint',
    description: 'Your personal guide to building the life you envision.',
  },
  {
    title: 'Define Your Life Areas',
    description: 'Identify the key areas of your life you want to improve.',
  },
  {
    title: 'Set Meaningful Goals',
    description: 'Create actionable goals that align with your vision.',
  },
  {
    title: 'Track Your Progress',
    description: 'Log daily actions and watch your life transform.',
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div>
      <div>
        <h1>{step.title}</h1>
        <p>{step.description}</p>
      </div>
      <div>
        {STEPS.map((_, index) => (
          <span key={index}>{index === currentStep ? '●' : '○'}</span>
        ))}
      </div>
      <div>
        {!isLastStep && <button onClick={handleSkip}>Skip</button>}
        <button onClick={handleNext}>{isLastStep ? 'Get Started' : 'Next'}</button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
