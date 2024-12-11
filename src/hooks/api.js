const speechToText = async (audioBlob) => {
  const endPoint = process.env.REACT_APP_STT_ENDPOINT;
  const subscriptionKey = process.env.REACT_APP_SPC_API_KEY;
  try {
    const response = await fetch(endPoint, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Content-Type": "audio/wav",
      },
      body: audioBlob,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`STT API 호출 실패: ${response.status} - ${errorText}`);
      throw new Error("STT API 호출에 실패했습니다.");
    }

    const data = await response.json();
    if (data && data.DisplayText) {
      console.log("STT 변환 결과:", data.DisplayText);
      return data.DisplayText;
    } else {
      console.error("응답 데이터에 DisplayText가 없습니다.");
      throw new Error("STT 변환 결과를 처리할 수 없습니다.");
    }
  } catch (error) {
    console.error("speechToText 오류:", error.message || error);
    throw error;
  }
};

const getGptResponse = async (text) => {
  console.log("api.getGptResponse >>>>>", text);
  const apiKey = process.env.REACT_APP_API_KEY;
  const endPoint = process.env.REACT_APP_API_ENDPOINT;
  console.log(endPoint);
  try {
    const response = await fetch(endPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: text }],
      }),
    });

    if (!response.ok) {
      console.error(
        `API 호출 실패: ${response.status} - ${response.statusText}`
      );
      const errorData = await response.text();
      throw new Error(errorData);
    }

    const data = await response.json();
    //   console.log(data);
    const result = data.choices[0].message.content.trim();
    console.log("GPT Response:", result);
    return result;
  } catch (error) {
    console.error("getGptResponse 오류:", error.message || error);
  }
};

// const synthesizeSpeech = async (text, voicename) => {
const synthesizeSpeech = async (text) => {
  const endPoint = process.env.REACT_APP_TTS_ENDPOINT;
  const subscriptionKey = process.env.REACT_APP_SPC_API_KEY;
  const response = await fetch(endPoint, {
    // access 와 같은 역할
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      "X-Microsoft-OutputFormat": "riff-16khz-16bit-mono-pcm",
      "Content-Type": "application/ssml+xml",
    },
    body: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ko-KR">
          <voice name="ko-KR-SunHiNeural">
          ${text}
          </voice>
          </speak>`,
  });
  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
};

export { speechToText, getGptResponse, synthesizeSpeech };
