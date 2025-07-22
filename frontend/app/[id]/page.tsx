'use client'
import React, { useState } from 'react';
import  ProblemPanel  from "../_components/QuestionPanel";
import CodeEditorPanel from "../_components/CodeEditorPanel";
import VideoCallPanel from "../_components/VideCall";

interface LanguageConfig {
  name: string;
  template: string;
}

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

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  description: string;
}

// Language configurations
const languageConfigs: Record<string, LanguageConfig> = {
  javascript: {
    name: 'JavaScript',
    template: `// Write your solution here
function reverseString(str) {
    // Your code here
    return str;
}`
  },
  python: {
    name: 'Python',
    template: `# Write your solution here
def reverse_string(s):
    # Your code here
    return s`
  },
  java: {
    name: 'Java',
    template: `public class Solution {
    public String reverseString(String str) {
        // Your code here
        return str;
    }
}`
  },
  cpp: {
    name: 'C++',
    template: `#include <string>
using namespace std;

class Solution {
public:
    string reverseString(string str) {
        // Your code here
        return str;
    }
};`
  }
};

// Mock question data
const questionData: Question = {
  title: "Reverse a String",
  body: "Write a function to reverse a string without using built-in methods like .reverse(). Your function should take a string as input and return the reversed string.",
  examples: [
    { input: '"hello"', output: '"olleh"' },
    { input: '"world"', output: '"dlrow"' },
    { input: '""', output: '""' }
  ],
  constraints: [
    "Do not use built-in reverse methods",
    "Handle empty strings gracefully",
    "Time complexity should be O(n)"
  ],
  testCases: [
    { input: "hello", expected: "olleh", description: "Basic string reversal" },
    { input: "world", expected: "dlrow", description: "Another basic case" },
    { input: "", expected: "", description: "Empty string" },
    { input: "a", expected: "a", description: "Single character" },
    { input: "12345", expected: "54321", description: "Numeric string" }
  ]
};

const LiveRoom: React.FC = () => {
  // State management
  const [selectedLanguage, setSelectedLanguage] = useState<string>('javascript');
  const [code, setCode] = useState<string>(languageConfigs.javascript.template);
  const [output, setOutput] = useState<string>('Click "Run Code" to test your solution...');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  // Event handlers
  const handleLanguageChange = (language: string): void => {
    setSelectedLanguage(language);
    setCode(languageConfigs[language].template);
    setOutput('Click "Run Code" to test your solution...');
    setTestResults([]);
  };

  const runCode = (): void => {
    setIsRunning(true);
    setOutput('Running test cases...\n');
    
    // Simulate code execution with test cases
    setTimeout(() => {
      const results: TestResult[] = questionData.testCases.map((testCase) => {
        let actual = '';
        let passed = false;
        
        try {
          if (selectedLanguage === 'javascript') {
            // Check if user is using built-in methods (simplified check)
            if (code.includes('split') && code.includes('reverse') && code.includes('join')) {
              actual = 'Error: Cannot use built-in reverse method';
              passed = false;
            } else {
              // Mock correct implementation for demo
              actual = testCase.input.split('').reverse().join('');
              passed = actual === testCase.expected;
            }
          } else {
            // Mock execution for other languages
            actual = testCase.input.split('').reverse().join('');
            passed = actual === testCase.expected;
          }
        } catch (e) {
          actual = `Runtime Error: ${e instanceof Error ? e.message : 'Unknown error'}`;
          passed = false;
        }

        return {
          passed,
          input: testCase.input,
          expected: testCase.expected,
          actual,
          description: testCase.description
        };
      });

      setTestResults(results);
      
      const passedCount = results.filter(r => r.passed).length;
      const totalCount = results.length;
      
      // Generate output text
      let outputText = `Test Results: ${passedCount}/${totalCount} test cases passed\n\n`;
      
      results.forEach((result, index) => {
        const status = result.passed ? '✅ PASS' : '❌ FAIL';
        outputText += `Test Case ${index + 1}: ${status}\n`;
        outputText += `Description: ${result.description}\n`;
        outputText += `Input: "${result.input}"\n`;
        outputText += `Expected: "${result.expected}"\n`;
        outputText += `Actual: "${result.actual}"\n`;
        if (!result.passed) {
          outputText += `❌ Test case failed!\n`;
        }
        outputText += `\n`;
      });

      if (passedCount === totalCount) {
        outputText += `🎉 All test cases passed! Great job!\n`;
        outputText += `\nRuntime: 0 ms\nMemory Usage: 41.2 MB`;
      } else {
        outputText += `❌ ${totalCount - passedCount} test case(s) failed. Please review your solution.`;
      }

      setOutput(outputText);
      setIsRunning(false);
    }, 1500);
  };

  return (
    <div className="h-screen bg-gray-100 grid grid-cols-12 gap-4 p-4">
      <ProblemPanel 
        question={questionData} 
      />
      
      <CodeEditorPanel
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        code={code}
        onCodeChange={setCode}
        onRunCode={runCode}
        isRunning={isRunning}
        output={output}
        testResults={testResults}
      />
      
      <VideoCallPanel />
    </div>
  );
};

export default LiveRoom;