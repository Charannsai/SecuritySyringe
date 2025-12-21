import { useState } from 'react';

async function callGateway() {
  const res = await fetch(
    "https://secure-gateway.pathurisai31.workers.dev/run",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Project-Key": "pk_live_iyk6t5tnqe8"
      },
      body: JSON.stringify({
        action: "ai.models"
      })
    }
  );

  const text = await res.text();
  console.log(text);
  return text;
}


function App() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCall = async () => {
    setLoading(true);
    try {
      const result = await callGateway();
      setResponse(result);
    } catch (error) {
      console.error(error);
      setResponse('Error calling gateway');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-800 rounded-xl p-8 border border-neutral-700 shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Security Cyanide
        </h1>

        <button
          onClick={handleCall}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg mb-6 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Calling Gateway...
            </>
          ) : (
            'Call Gateway'
          )}
        </button>

        {response && (
          <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
            <h3 className="text-sm font-medium text-neutral-400 mb-2">Response:</h3>
            <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap overflow-x-auto">
              {response}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
