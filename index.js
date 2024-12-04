export default {
    async fetch(request, env) {
        if (request.method === 'GET' && !request.url.includes('?prompt=')) {
            return new Response(
                `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Image Generator with Workers</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="flex items-center justify-center min-h-screen bg-blue-600">
            <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
              <h1 class="text-lg font-bold text-gray-800 mb-4 text-center">Generate Image with AI - (FaaS) </h1>
              <textarea 
                id="prompt" 
                placeholder="Write your prompt here..." 
                class="w-full h-24 p-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
              ></textarea>
              <select 
                id="model" 
                class="w-full p-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              >
                <option value="@cf/stabilityai/stable-diffusion-xl-base-1.0">Stable Diffusion XL Base 1.0</option>
                <option value="@cf/lykon/dreamshaper-8-lcm">Dreamshaper 8 LCM</option>
                <option value="@cf/bytedance/stable-diffusion-xl-lightning">Stable Diffusion XL Lightning</option>
              </select>
              <button 
                id="generateButton" 
                class="w-full mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Submit
              </button>
              <!-- Loading Indicator -->
              <div id="loadingIndicator" class="mt-4 hidden flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span class="ml-2 text-blue-500">Generating...</span>
              </div>
              <!-- Image Display Area -->
              <div id="imageContainer" class="mt-6 hidden">
                <img id="generatedImage" src="" alt="Generated Image" class="w-full rounded-lg">
                <a 
                  id="downloadButton" 
                  href="#" 
                  download="generated-image.png" 
                  class="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition block text-center"
                >
                  Download Image
                </a>
              </div>
                           <p class="text-center text-sm text-gray-600 mt-12">
  © Developed by 
  <a href="https://github.com/aminesmkhani" target="_blank" class="flex items-center justify-center text-blue-500 hover:underline">
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-4 h-4 mr-1" viewBox="0 0 24 24">
      <path d="M12 .296C5.373.296 0 5.669 0 12.296c0 5.304 3.438 9.799 8.207 11.385.599.111.793-.261.793-.579 0-.287-.011-1.244-.016-2.254-3.338.726-4.042-1.609-4.042-1.609-.546-1.389-1.332-1.758-1.332-1.758-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.833 2.808 1.304 3.492.997.108-.775.419-1.305.762-1.604-2.665-.303-5.467-1.333-5.467-5.932 0-1.31.469-2.381 1.235-3.221-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.982-.399 3.003-.404 1.02.005 2.046.138 3.003.404 2.293-1.552 3.301-1.23 3.301-1.23.653 1.653.241 2.873.118 3.176.768.84 1.234 1.911 1.234 3.221 0 4.61-2.805 5.625-5.475 5.921.43.372.815 1.102.815 2.222 0 1.605-.015 2.899-.015 3.293 0 .32.192.695.801.578C20.565 22.094 24 17.6 24 12.296 24 5.669 18.627.296 12 .296z"/>
    </svg>
    aminesmkhani
  </a>
  </p>
            </div>
  
            <script>
              document.getElementById('generateButton').addEventListener('click', async () => {
                const prompt = document.getElementById('prompt').value.trim();
                const selectedModel = document.getElementById('model').value;
                const generateButton = document.getElementById('generateButton');
                const promptInput = document.getElementById('prompt');
                const loadingIndicator = document.getElementById('loadingIndicator');
                const imageContainer = document.getElementById('imageContainer');
                const generatedImage = document.getElementById('generatedImage');
                const downloadButton = document.getElementById('downloadButton');
  
                if (!prompt) {
                  alert('Please enter a prompt!');
                  return;
                }
                generateButton.disabled = true;
                promptInput.disabled = true;
                document.getElementById('model').disabled = true;
  
                loadingIndicator.classList.remove('hidden');
                imageContainer.classList.add('hidden');
  
                try {
                  const response = await fetch(
                    '?prompt=' + encodeURIComponent(prompt) + '&model=' + encodeURIComponent(selectedModel)
                  );
                  if (!response.ok) {
                    throw new Error('Failed to generate image');
                  }
  
                  const blob = await response.blob();
                  const imageUrl = URL.createObjectURL(blob);
  
                  generatedImage.src = imageUrl;
                  downloadButton.href = imageUrl;
                  imageContainer.classList.remove('hidden');
                } catch (error) {
                  alert('Error: ' + error.message);
                } finally {
                  generateButton.disabled = false;
                  promptInput.disabled = false;
                  document.getElementById('model').disabled = false;
  
              
                  loadingIndicator.classList.add('hidden');
                }
              });
            </script>
          </body>
          </html>
          `,
                {
                    headers: { 'content-type': 'text/html' },
                }
            );
        } else if (request.method === 'GET') {
            const url = new URL(request.url);
            const prompt = url.searchParams.get('prompt');
            const model = url.searchParams.get('model');

            if (!prompt || !model) {
                return new Response('Missing "prompt" or "model" query parameter', { status: 400 });
            }

            try {
                const inputs = { prompt };
                const response = await env.AI.run(model, inputs);

                return new Response(response, {
                    headers: {
                        'content-type': 'image/png',
                    },
                });
            } catch (error) {
                return new Response(`Error: ${error.message}`, { status: 500 });
            }
        }
    },
};