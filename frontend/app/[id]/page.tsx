'use client'
import React, { useState, useEffect } from 'react';
import ProblemPanel from "../_components/QuestionPanel";
import CodeEditorPanel from "../_components/CodeEditorPanel";
import VideoCallPanel from "../_components/VideCall";
import { useWebSocket } from '../_components/websocket/WebSocketContext';

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

// Mock question data - fallback when WebSocket question is not available
const mockQuestionData: Question = {
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

// Generate a random user ID
const generateUserId = (): string => {
  return `user_${Math.random().toString(36).substr(2, 9)}`;
};

// Get room ID from URL or generate one
const getRoomId = (): string => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('room') || `room_${Math.random().toString(36).substr(2, 9)}`;
  }
  return `room_${Math.random().toString(36).substr(2, 9)}`;
};

const LiveRoom: React.FC = () => {
  // State management
  const [selectedLanguage, setSelectedLanguage] = useState<string>('javascript');
  const [code, setCode] = useState<string>(languageConfigs.javascript.template);
  const [output, setOutput] = useState<string>('Click "Run Code" to test your solution...');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [roomId] = useState<string>(getRoomId());
  const [userId] = useState<string>(generateUserId());
  const [hasJoinedRoom, setHasJoinedRoom] = useState<boolean>(false);

  // WebSocket connection
  const { question, joinRoom, isConnected, connectionStatus, lastMessage } = useWebSocket();

  // Use mock data as fallback
  const currentQuestion = question || mockQuestionData;

  // Auto-join room when connected
  useEffect(() => {
    if (isConnected && !hasJoinedRoom) {
      console.log(`🚪 Auto-joining room: ${roomId} with user: ${userId}`);
      joinRoom(roomId, userId);
      setHasJoinedRoom(true);
    }
  }, [isConnected, hasJoinedRoom, roomId, userId, joinRoom]);

  // Handle initialization state
  useEffect(() => {
    if (isConnected) {
      // Give some time for room joining and question loading
      const timer = setTimeout(() => {
        setIsInitializing(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (connectionStatus === 'error') {
      setIsInitializing(false);
    }
  }, [isConnected, connectionStatus]);

  // Debug: Log WebSocket data
  useEffect(() => {
    console.log('WebSocket State:', { 
      question: !!question, 
      isConnected, 
      connectionStatus, 
      lastMessage,
      roomId,
      userId 
    });
  }, [question, isConnected, connectionStatus, lastMessage, roomId, userId]);

  // Event handlers
  const handleLanguageChange = (language: string): void => {
    if (!languageConfigs[language]) {
      console.error(`Language ${language} not supported`);
      return;
    }
    
    setSelectedLanguage(language);
    setCode(languageConfigs[language].template);
    setOutput('Click "Run Code" to test your solution...');
    setTestResults([]);
  };

  const runCode = (): void => {
    if (!code.trim()) {
      setOutput('❌ Please write some code before running tests.');
      return;
    }

    setIsRunning(true);
    setOutput('Running test cases...\n');
    
    // Simulate code execution with test cases
    setTimeout(() => {
      try {
        const questionToUse = question || mockQuestionData;
        const results: TestResult[] = questionToUse.testCases.map((testCase) => {
          let actual = '';
          let passed = false;
          
          try {
            if (selectedLanguage === 'javascript') {
              // Check if user is using built-in methods (simplified check)
              if (code.includes('.reverse()') || (code.includes('split') && code.includes('reverse') && code.includes('join'))) {
                actual = 'Error: Cannot use built-in reverse method';
                passed = false;
              } else {
                // Mock correct implementation for demo
                // In a real scenario, you'd execute the user's code safely
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
          outputText += `\nRuntime: ${Math.floor(Math.random() * 100)} ms\nMemory Usage: ${(40 + Math.random() * 10).toFixed(1)} MB`;
        } else {
          outputText += `❌ ${totalCount - passedCount} test case(s) failed. Please review your solution.`;
        }

        setOutput(outputText);
      } catch (error) {
        setOutput(`❌ Error running tests: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsRunning(false);
      }
    }, 1500);
  };

  // Manual room join function for testing
  const handleManualJoin = () => {
    console.log('🔄 Manually joining room...');
    joinRoom(roomId, userId);
  };

  // Connection status component
  const ConnectionStatus = () => (
    <div className={`flex items-center space-x-2 ${
      connectionStatus === 'connected' ? 'text-green-600' : 
      connectionStatus === 'connecting' ? 'text-yellow-600' :
      'text-red-600'
    }`}>
      <div className={`w-2 h-2 rounded-full ${
        connectionStatus === 'connected' ? 'bg-green-500' : 
        connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
        'bg-red-500'
      }`}></div>
      <span className="text-sm font-medium">
        {connectionStatus === 'connected' ? 'Connected' :
         connectionStatus === 'connecting' ? 'Connecting...' :
         connectionStatus === 'error' ? 'Connection Error' :
         'Disconnected'}
      </span>
    </div>
  );

  // Loading state
  if (isInitializing && connectionStatus !== 'error') {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Loading interview room...</p>
          <p className="text-sm text-gray-500">Room: {roomId}</p>
          <p className="text-sm text-gray-400">User: {userId}</p>
          {lastMessage && (
            <p className="text-xs text-gray-400 mt-2">{lastMessage}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Live Coding Interview</h1>
            <p className="text-sm text-gray-500">Room: {roomId} | User: {userId}</p>
          </div>
          <div className="flex items-center space-x-4">
            <ConnectionStatus />
            {!isConnected && (
              <button
                onClick={handleManualJoin}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry Connection
              </button>
            )}
          </div>
        </div>
        {lastMessage && (
          <div className="mt-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded">
            {lastMessage}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-12 gap-4 p-4 min-h-0">
        {/* Problem Panel */}
        <div className="col-span-12 lg:col-span-4 min-h-0">
          {question ? (
            <ProblemPanel question={question} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-6 h-full">
              <div className="text-center">
                <div className="mb-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                    {isConnected ? '⏳ Waiting for question...' : '🔌 Connecting...'}
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isConnected ? 'Ready for Interview' : 'Connecting to Server'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {isConnected 
                    ? 'Your interviewer will send you a coding question shortly. Make sure both participants have joined the room.' 
                    : 'Establishing connection to the interview room...'}
                </p>
                {isConnected && (
                  <div className="text-sm text-gray-500">
                    <p>Room ID: <code className="bg-gray-100 px-2 py-1 rounded">{roomId}</code></p>
                    <p className="mt-1">Share this room ID with your interviewer</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Code Editor Panel */}
        <div className="col-span-12 lg:col-span-5 min-h-0">
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
        </div>
        
        {/* Video Call Panel */}
        <div className="col-span-12 lg:col-span-3 min-h-0">
          <VideoCallPanel />
        </div>
      </div>
    </div>
  );
};

export default LiveRoom;