// src/config/config.ts
export type QuestionType = 'text' | 'radio' | 'checkbox';

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  options?: string[];
  required?: boolean;
  pattern?: RegExp;            
  errorMessage?: string;
}

export interface Screen {
  id: string;
  questions: Question[];
}

export interface Chapter {
  id: string;
  title: string;
  screens: Screen[];
}

export const formConfig: Chapter[] = [
  {
    id: 'chapter1',
    title: 'Personal Info',
    screens: [
      {
        id: 'screen1',
        questions: [
          { id: 'q1', type: 'text', label: 'First Name', required: true, pattern: /^[A-Za-z]+$/, errorMessage: 'Invalid first name'},
          { id: 'q2', type: 'text', label: 'Last Name', required: true, pattern: /^[A-Za-z]+$/, errorMessage: 'Invalid last name' },
        ],
      },
      {
        id: 'screen2',
        questions: [
          { id: 'q3', type: 'radio', label: 'Gender', options: ['Male', 'Female', 'Other'], required: true},
          { id: 'q4', type: 'checkbox', label: 'Hobbies', options: ['Reading', 'Traveling', 'Gaming'], required: true },
        ],
      },
    ],
  },
  {
    id: 'chapter2',
    title: 'Professional Info',
    screens: [
      {
        id: 'screen3',
        questions: [
          { id: 'q5', type: 'text', label: 'Current Job', required: true,  pattern: /^[A-Za-z]+$/, errorMessage: 'Invalid. Enter a valid job title'},
          { id: 'q6', type: 'text', label: 'Experience (Years)', required: true, pattern: /[0-9]+/, errorMessage: 'Invalid. Enter a number'},
        ],
      },
      {
        id: 'screen4',
        questions: [
          { id: 'q7', type: 'radio', label: 'Employment Type', options: ['Full-time', 'Part-time', 'Freelance'], required: true },
          { id: 'q8', type: 'checkbox', label: 'Skills', options: ['React', 'Node.js', 'Python'], required: true },
        ],
      },
    ],
  },
];
