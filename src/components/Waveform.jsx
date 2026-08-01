import { useEffect, useRef } from 'react';

export default function Waveform({ analyserNode, isRecording }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      /* Soft cream background */
      ctx.fillStyle = '#FAF7F2';
      ctx.fillRect(0, 0, width, height);

      if (isRecording && analyserNode) {
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserNode.getByteTimeDomainData(dataArray);

        ctx.lineWidth = 3;
        ctx.strokeStyle = '#7C66DC'; // Soft Lavender Purple
        ctx.beginPath();

        const sliceWidth = (width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
      } else {
        /* Idle baseline */
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#D1CBEF';
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [analyserNode, isRecording]);

  return (
    <div className="w-full bg-[#FAF7F2] rounded-xl p-2 border border-[#EFE9E0]">
      <canvas
        ref={canvasRef}
        width={600}
        height={90}
        className="w-full h-24 rounded-lg block"
        aria-label="Live voice recording waveform display"
        role="img"
      />
    </div>
  );
}
