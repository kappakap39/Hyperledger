import OpenAI from 'openai';

// สร้างออบเจกต์ที่มี properties ที่ต้องการ
const openaiOptions = {
    apiKey: 'sk-proj-Rp2TGkaRNTdATUwQF5ExT3BlbkFJsQXhQ3aAvCMufXR7vQs1', // API Key สำหรับเข้าถึง OpenAI
    organization: 'org-deithXfHI1yfJADaGIseJFQf', // Organization ID ของ OpenAI
};

const openai = new OpenAI(openaiOptions);

const handleOpenAIRequest_services = async (chat) => {
    console.log('chat:', chat);
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: chat }],
            stream: false,
        });

        console.log('response:', response);

        let generatedText = '';

        if (response.choices && response.choices.length > 0) {
            console.log('Logprobs:', response.choices[0]?.logprobs);
            generatedText += response.choices[0]?.message?.content || '';
        } else {
            console.error('No choices found in the response.');
        }

        return { chat, generatedText };
    } catch (error) {
        if (error.code === 'insufficient_quota') {
            console.error('You have exceeded your quota. Please check your plan and billing details.');
            return { error: 'You have exceeded your quota. Please check your plan and billing details.' };
        } else {
            console.error('Error processing chatbot request:', error);
            return { error: 'Internal server error. Please check your request.' };
        }
    }
};

export { handleOpenAIRequest_services };

