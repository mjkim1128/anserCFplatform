import { useState } from "react";

export default function OCRPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!file) {
      alert("파일을 선택하세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    // extracted_text는 나중에 AI가 처리할 텍스트라 임시로 빈 문자열 전달
    formData.append("extracted_text", "");

    const res = await fetch("http://localhost:8000/ocr", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  };

  return (
    <main className="p-6 max-w-lg mx-auto">
      <button
        style={{
          width: '150px',
          height: '50px',
          backgroundImage: `url('./images/uploadImage.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: 'none',
          cursor: 'default',
        }}
        //onClick={() => alert('버튼 클릭!')}
      >
      </button>
      <br></br>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        className="mb-4"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        업로드
      </button>
      {result && (
        <pre className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap">
          {result}
        </pre>
      )}
    </main>
  );
}
