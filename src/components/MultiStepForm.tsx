
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { formConfig } from '../config/config';
import Question from './Question';

const MultiStepForm = () => {
  const methods = useForm({ mode: 'onChange' });
  const { handleSubmit, trigger, formState, getValues } = methods;

  const [chapterIndex, setChapterIndex] = useState(0);
  const [screenIndex, setScreenIndex] = useState(0);

  const currentScreen = formConfig[chapterIndex].screens[screenIndex];

  const onNext = async () => {
    const valid = await trigger(currentScreen.questions.map(q => q.id));
    if (!valid) return;

    if (screenIndex + 1 < formConfig[chapterIndex].screens.length) {
      setScreenIndex(prev => prev + 1);
    } else if (chapterIndex + 1 < formConfig.length) {
      setChapterIndex(prev => prev + 1);
      setScreenIndex(0);
    }
  };

  const onBack = () => {
    if (screenIndex > 0) setScreenIndex(prev => prev - 1);
    else if (chapterIndex > 0) {
      setChapterIndex(prev => prev - 1);
      setScreenIndex(formConfig[chapterIndex - 1].screens.length - 1);
    }
  };

  const onSubmit = (data: any) => {
    console.log('Form Submission:', data);
    alert('Form submitted! Check console for answers.');
  };

  // Check if all required fields on current screen are valid
  const isCurrentScreenValid = currentScreen.questions.every(q => {
    const value = getValues(q.id);
    const hasError = formState.errors[q.id];
    // For text, radio, checkbox we just check if not empty and no error
    if (q.type === 'checkbox') {
      return Array.isArray(value) && value.length > 0 && !hasError;
    }
    return value && !hasError;
  });

  return (
    <FormProvider {...methods}>
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="max-w-md w-full mx-auto p-6 bg-white shadow-md rounded-lg"
  >
    <h2 className="text-xl font-bold mb-4 text-center">{formConfig[chapterIndex].title}</h2>

    {currentScreen.questions.map(q => (
      <Question key={q.id} question={q} register={methods.register} errors={formState.errors} />
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

      {chapterIndex === formConfig.length - 1 && screenIndex === currentScreen.questions.length - 1 ? (
        <button
          type="submit"
          className={`px-4 py-2 rounded ${
            formState.isValid
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-400 cursor-not-allowed text-gray-700'
          }`}
          disabled={!formState.isValid}
        >
          Submit
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className={`px-4 py-2 rounded ${
            formState.isValid
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-400 cursor-not-allowed text-gray-700'
          }`}
          disabled={!formState.isValid}
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
