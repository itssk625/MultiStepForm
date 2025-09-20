import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { formConfig } from '../config/config';
import Question from './Question';

const MultiStepForm: React.FC = () => {
  const methods = useForm({ mode: 'onChange' });
  const { handleSubmit, trigger, formState } = methods;

  const [chapterIndex, setChapterIndex] = useState(0);
  const [screenIndex, setScreenIndex] = useState(0);

  const currentScreen = formConfig[chapterIndex].screens[screenIndex];
  const totalScreens = formConfig.flatMap(c => c.screens).length;
  const currentStep = screenIndex + 1 + formConfig.slice(0, chapterIndex).flatMap(c => c.screens).length;

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
    const formattedData: any = {};
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) formattedData[key] = data[key].filter(Boolean);
      else formattedData[key] = data[key];
    });

    console.log('Form Submission:', formattedData);
    alert('Form submitted! Check console for answers.');
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md w-full bg-purple-50 shadow-2xl rounded-2xl p-6 mx-auto"
      >
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
            <span>Step {currentStep}</span>
            <span>{totalScreens}</span>
          </div>
          <div className="w-full bg-pink-100 h-2 rounded-full">
            <div
              className="bg-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalScreens) * 100}%` }}
            ></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">{formConfig[chapterIndex].title}</h2>

        {currentScreen.questions.map(q => (
          <Question key={q.id} question={q} register={methods.register} errors={formState.errors} />
        ))}

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onBack}
            disabled={chapterIndex === 0 && screenIndex === 0}
            className="px-4 py-2 rounded-md bg-gray-300 disabled:opacity-50 hover:bg-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Back
          </button>

          {chapterIndex === formConfig.length - 1 && screenIndex === currentScreen.questions.length - 1 ? (
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Submit
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
