import React from 'react';
import { Question as QuestionType } from '../config/config';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface Props {
  question: QuestionType;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

const Question: React.FC<Props> = ({ question, register, errors }) => {
  // Safely get the error message if exists
  const error = errors[question.id];
  const message =
    error && typeof error === 'object' && 'message' in error
      ? error.message
      : undefined;

  return (
    <div className="mb-5">
      <label className="block font-medium mb-2 text-purple-800">
        {question.label}
        {question.required && '*'}
      </label>

      {/* Text input */}
      {question.type === 'text' && (
  <>
    <input
      type="text"
      {...register(question.id, {
        required: question.required,
        pattern: question.pattern
          ? { value: question.pattern, message: question.errorMessage || 'Invalid input' }
          : undefined,
      })}
      className={`border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-400 ${
        message ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {message && (
      <p className="text-red-500 text-sm mt-1">{String(message)}</p>
    )}
  </>
)}


      {/* Radio buttons */}
      {question.type === 'radio' &&
        question.options?.map(option => (
          <label key={option} className="flex items-center mb-2 cursor-pointer">
            <input
              type="radio"
              value={option}
              {...register(question.id, { required: question.required })}
              className="form-radio h-5 w-5 text-pink-500 accent-pink-500 mr-2"
            />
            <span className="text-purple-700">{option}</span>
          </label>
        ))}

      {/* Checkbox */}
      {question.type === 'checkbox' &&
        question.options?.map(option => (
          <label key={option} className="flex items-center mb-2 cursor-pointer">
            <input
              type="checkbox"
              value={option}
              {...register(question.id)}
              className="form-checkbox h-5 w-5 text-green-500 accent-green-500 mr-2"
            />
            <span className="text-purple-700">{option}</span>
          </label>
        ))}
    </div>
  );
};

export default Question;
