import React from 'react';
import { Play, Terminal, ChevronDown } from 'lucide-react';

interface LanguageConfig {
  name: string;
  template: string;
}

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  description: string;
}

interface CodeEditorPanelProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  code: string;
  onCodeChange: (code: string) => void;
  onRunCode: () => void;
  isRunning: boolean;
  output: string;
  testResults: TestResult[];
}

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
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

// Simple Monaco Editor Mock
const MonacoEditor: React.FC<MonacoEditorProps> = ({ value, onChange, language = "javascript" }) => {
  const getPlaceholder = (lang: string): string => {
    return languageConfigs[lang]?.template || value;
  };

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-full font-mono text-sm p-4 bg-gray-900 text-green-400 border-none resize-none outline-none"
      placeholder={getPlaceholder(language)}
      spellCheck={false}
      style={{
        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace'
      }}
    />
  );
};

const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({ 
  selectedLanguage, 
  onLanguageChange, 
  code, 
  onCodeChange, 
  onRunCode, 
  isRunning, 
  output, 
  testResults 
}) => {
  const getFileExtension = (lang: string): string => {
    switch (lang) {
      case 'javascript': return 'js';
      case 'python': return 'py';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'js';
    }
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      {/* Editor Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="ml-2 text-gray-300 text-sm">
              solution.{getFileExtension(selectedLanguage)}
            </span>
          </div>
          
          {/* Language Selector */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm border border-gray-600 focus:outline-none focus:border-blue-500 appearance-none pr-8"
            >
              {Object.entries(languageConfigs).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <button
          onClick={onRunCode}
          disabled={isRunning}
          className="flex items-center space-x-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
        >
          <Play size={14} />
          <span>{isRunning ? 'Running...' : 'Run Code'}</span>
        </button>
      </div>

      {/* Code Editor */}
      <div className="flex-1 min-h-0">
        <MonacoEditor
          value={code}
          onChange={onCodeChange}
          language={selectedLanguage}
        />
      </div>

      {/* Output Terminal */}
      <div className="h-40 border-t border-gray-200 bg-gray-900 flex-shrink-0">
        <div className="flex items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
          <Terminal size={36} className="text-gray-400 mr-2" />
          <span className="text-gray-300 text-sm">Test Results</span>
          {testResults.length > 0 && (
            <span className="ml-auto text-xs text-gray-400">
              {testResults.filter(r => r.passed).length}/{testResults.length} passed
            </span>
          )}
        </div>
        <div className="p-4 h-full overflow-y-auto">
          <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPanel;