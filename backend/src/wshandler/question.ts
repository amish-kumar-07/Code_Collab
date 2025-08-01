// wshandler/question.ts - HTTP approach (if you prefer this)
export async function getQuestion(roomId: string) {
  try {
    console.log(`🔍 Getting question for room: ${roomId}`);
    
    // Convert roomId to question index
    const questionIndex = Math.floor(Math.random()*51); // You have 50 questions
    
    const response = await fetch('http://localhost:3001/getQuestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: questionIndex })
    });
    
    // ✅ Only read the response body ONCE
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json(); // Read only once!
    
    if (!data.question) {
      throw new Error('Question not found in response');
    }
    
    console.log(`✅ Successfully got question for room ${roomId}`);
    return data.question;
    
  } catch (error) {
    console.error(`❌ Error getting question for room ${roomId}:`, error);
    throw error;
  }
}
