import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { formConfig } from '../config/config';
import Question from './Question';

const MultiStepForm: React.FC = () => {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [screenIndex, setScreenIndex] = useState(0);
  const [canContinue, setCanContinue] = useState(false);

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, trigger, formState, getValues } = methods;

  const currentScreen = formConfig[chapterIndex].screens[screenIndex];
  const currentFieldIds = currentScreen.questions.map(q => q.id);

  // Update canContinue when errors or values change
  useEffect(() => {
    const valid = currentFieldIds.every(
      id => !formState.errors[id] && getValues(id) !== undefined && getValues(id) !== ''
    );
    setCanContinue(valid);
  }, [formState.errors, getValues, currentFieldIds]);

  const onNext = async () => {
    const isValid = await trigger(currentFieldIds);
    if (!isValid) return;

    const nextScreenIndex = screenIndex + 1;
    const nextChapterIndex = chapterIndex + 1;

    if (nextScreenIndex < formConfig[chapterIndex].screens.length) {
      setScreenIndex(nextScreenIndex);
    } else if (nextChapterIndex < formConfig.length) {
      setChapterIndex(nextChapterIndex);
      setScreenIndex(0);
    }
  };

  const onBack = () => {
    if (screenIndex > 0) {
      setScreenIndex(prev => prev - 1);
    } else if (chapterIndex > 0) {
      setChapterIndex(prev => prev - 1);
      setScreenIndex(formConfig[chapterIndex - 1].screens.length - 1);
    }
  };

  const onSubmit = (data: Record<string, any>) => {
    console.log('Form Submission:', data);
    alert('Form submitted! Check console for answers.');
  };

  const isLastScreen =
    chapterIndex === formConfig.length - 1 &&
    screenIndex === formConfig[chapterIndex].screens.length - 1;

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screenIndex, chapterIndex]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md w-full mx-auto p-6 bg-white shadow-md rounded-lg"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          {formConfig[chapterIndex].title}
        </h2>

        {currentScreen.questions.map(q => (
          <Question
            key={q.id}
            question={q}
            register={methods.register}
            errors={formState.errors}
          />
        ))}

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onBack}
            disabled={chapterIndex === 0 && screenIndex === 0}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Back
          </button>

          {isLastScreen ? (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              disabled={!canContinue}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Continue
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default MultiStepForm;
