'use client'
import { useEffect } from 'react';

interface Example {
  input: string;
  output: string;
}

interface TestCase {
  input: string;
  expected: string;
  description: string;
}

interface Question {
  title: string;
  body: string;
  examples: Example[];
  constraints: string[];
  testCases: TestCase[];
}

interface ProblemPanelProps {
  question: Question;
}

export default function ProblemPanel({ question }: ProblemPanelProps) {
  useEffect(() => {
    
  }, [question]);
  return (
    <div className="col-span-3 bg-white rounded-lg shadow-md p-6 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{question.title}</h1>
        <div className="prose prose-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Problem Description</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">{question.body}</p>
          
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Examples</h3>
          <div className="bg-gray-50 p-3 rounded mb-4">
            {question.examples.map((example, index) => (
              <div key={index} className="mb-2">
                <div className="font-mono text-sm">
                  <span className="text-blue-600">Input:</span> {example.input}
                </div>
                <div className="font-mono text-sm">
                  <span className="text-green-600">Output:</span> {example.output}
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mb-2">Constraints</h3>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
            {question.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};


