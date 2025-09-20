import React from 'react';
import { Question as QuestionType } from '../config/config';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface Props {
  question: QuestionType;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

const Question: React.FC<Props> = ({ question, register, errors }) => {
  return (
    <div className="mb-5">
      <label className="block font-medium mb-2 text-purple-800">
        {question.label}{question.required && '*'}
      </label>

      {question.type === 'text' && (
        <input
          type="text"
          {...register(question.id, { required: question.required })}
          className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-400 ${errors[question.id] ? 'border-red-500' : 'border-purple-300'}`}
        />
      )}

      {question.type === 'radio' && question.options?.map(option => (
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

      {question.type === 'checkbox' && question.options?.map(option => (
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

      {errors[question.id] && <p className="text-red-500 text-sm mt-1">This field is required</p>}
    </div>
  );
};

export default Question;
