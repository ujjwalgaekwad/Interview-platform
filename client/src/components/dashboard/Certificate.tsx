import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Link } from "react-router-dom";
import { IoMdDownload, IoMdHome } from "react-icons/io";

type CertificateProps = {
  name: string;
  role: string;
  score: number;
  id: string;
  greeting?: string;
};

const Certificate: React.FC<CertificateProps> = ({ name, role, score, id, greeting = "Congratulations on your achievement!" }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadPDF = () => {
    if (certificateRef.current) {
      html2canvas(certificateRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("landscape", "mm", "a4");
        pdf.addImage(imgData, "PNG", 10, 10, 280, 190);
        pdf.save(`${name}-certificate.pdf`);
      });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4">

      <div
        ref={certificateRef}
        className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] border border-border/70 bg-white p-10 sm:p-12"
      >
        {/* Subtle Background Gradient & Watermark Effect */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-white to-cyan-50 opacity-80"></div>
        </div>

        <div className="relative z-10 text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight text-slate-900 uppercase sm:text-6xl">
            Certificate of Achievement
          </h1>
          <p className="mt-6 text-2xl text-slate-600">This certificate is awarded to</p>
          <h2 className="font-display mt-4 text-5xl font-bold text-primary">{name}</h2>
          <p className="mt-6 text-2xl text-slate-700">For outstanding performance in</p>
          <h3 className="mt-2 text-3xl font-semibold text-slate-900">{role}</h3>
          <p className="mt-6 text-2xl text-slate-700">Achieving a score of</p>
          <div className="mt-4">
            <span className="font-display text-6xl font-bold text-emerald-500">{score}</span>
          </div>
          <p className="mt-6 text-xl italic text-slate-600">{greeting}</p>

          <div className="mt-12 flex justify-between items-center px-12">
            <div className="text-center">
              <p className="text-lg text-slate-500">Authorized Signature</p>
              <div className="mt-2 mx-auto w-48 border-t border-slate-400"></div>
            </div>
            <div className="text-center">
              <p className="text-lg text-slate-500">Date</p>
              <p className="mt-2 text-xl text-slate-700">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-6 right-6">
          <p className="text-sm text-slate-500">ID: {id}</p>
        </div>
      </div>

      <div className="flex space-x-1 py-12">
        <button
          onClick={downloadPDF}
          className="rounded-s-2xl border border-border/70 bg-card/80 p-4 text-2xl text-foreground hover:bg-accent"
        >
          <IoMdDownload />
        </button>
        <Link className="block rounded-e-2xl border border-border/70 bg-card/80 p-4 text-2xl text-foreground hover:bg-red-500 hover:text-white" to="/dashboard">
          <IoMdHome />
        </Link>
      </div>
    </div>
  );
};

export default Certificate;
