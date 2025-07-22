// File: components/CodeEditor.tsx
'use client';

import React from "react";
import { ChevronDown, Play, Terminal } from "lucide-react";
import MonacoEditor from "@monaco-editor/react";

type TestResult = {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  description: string;
};

type CodeEditorProps = {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  code: string;
  onCodeChange: (code: string | undefined) => void;
  onRunCode: () => void;
  isRunning: boolean;
  output: string;
  testResults: TestResult[];
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  selectedLanguage,
  onLanguageChange,
  code,
  onCodeChange,
  onRunCode,
  isRunning,
  output,
  testResults,
}) => {
  const fileExtension = selectedLanguage === 'javascript' ? 'js'
                      : selectedLanguage === 'python' ? 'py'
                      : selectedLanguage === 'java' ? 'java'
                      : 'cpp';

  return (
    <div className="col-span-6 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      {/* Editor Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="ml-2 text-gray-300 text-sm">
              solution.{fileExtension}
            </span>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm border border-gray-600 focus:outline-none focus:border-blue-500 appearance-none pr-8"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        <button
          onClick={onRunCode}
          disabled={isRunning}
          className="flex items-center space-x-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
        >
          <Play size={14} />
          <span>{isRunning ? "Running..." : "Run Code"}</span>
        </button>
      </div>

      {/* Code Editor */}
      <div className="flex-1 min-h-0">
        <MonacoEditor
          value={code}
          onChange={onCodeChange}
          language={selectedLanguage}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
      </div>

      {/* Output Terminal */}
      <div className="h-64 border-t border-gray-200 bg-gray-900">
        <div className="flex items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
          <Terminal size={16} className="text-gray-400 mr-2" />
          <span className="text-gray-300 text-sm">Test Results</span>
          {testResults.length > 0 && (
            <span className="ml-auto text-xs text-gray-400">
              {testResults.filter((r) => r.passed).length}/{testResults.length} passed
            </span>
          )}
        </div>
        <div className="p-4 h-full overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-400 text-xs">Run code to see results.</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="mb-2">
                <pre className={`text-xs font-mono whitespace-pre-wrap ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
{`Test ${index + 1}: ${result.description}
Input: ${result.input}
Expected: ${result.expected}
Actual: ${result.actual}
Result: ${result.passed ? 'Passed ✅' : 'Failed ❌'}`}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
