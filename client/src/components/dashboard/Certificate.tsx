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
        className="relative w-full max-w-4xl mx-auto bg-white p-12 rounded-lg shadow-xl border border-gray-200 overflow-hidden"
      >
        {/* Subtle Background Gradient & Watermark Effect */}
        <div className="absolute inset-0 transform rotate-3">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-200 opacity-20"></div>
        </div>

        <div className="relative z-10 text-center">
          <h1 className="text-6xl font-serif font-bold text-gray-800 tracking-wide uppercase">
            Certificate of Achievement
          </h1>
          <p className="mt-6 text-2xl text-gray-600">This certificate is awarded to</p>
          <h2 className="mt-4 text-5xl font-serif font-bold text-blue-600">{name}</h2>
          <p className="mt-6 text-2xl text-gray-700">For outstanding performance in</p>
          <h3 className="mt-2 text-3xl font-semibold text-gray-900">{role}</h3>
          <p className="mt-6 text-2xl text-gray-700">Achieving a score of</p>
          <div className="mt-4">
            <span className="text-6xl font-bold text-green-500">{score}</span>
          </div>
          <p className="mt-6 text-xl italic text-gray-600">{greeting}</p>

          <div className="mt-12 flex justify-between items-center px-12">
            <div className="text-center">
              <p className="text-lg text-gray-500">Authorized Signature</p>
              <div className="mt-2 border-t border-gray-400 w-48 mx-auto"></div>
            </div>
            <div className="text-center">
              <p className="text-lg text-gray-500">Date</p>
              <p className="mt-2 text-xl text-gray-700">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-6 right-6">
          <p className="text-sm text-gray-500">ID: {id}</p>
        </div>
      </div>

      <div className="flex space-x-1 py-12">
        <button
          onClick={downloadPDF}
          className="bg-zinc-200 text-2xl dark:bg-zinc-800 text-black dark:text-white p-4 rounded-s-lg shadow-md hover:bg-zinc-800 hover:text-zinc-100 dark:hover:bg-zinc-200 dark:hover:text-zinc-900 transition"
        >
          <IoMdDownload />
        </button>
        <Link className="bg-zinc-200 text-2xl dark:bg-zinc-800 text-black dark:text-white p-4 rounded-e-lg shadow-md hover:bg-red-500 dark:hover:bg-red-500 transition block" to="/dashboard">
          <IoMdHome />
        </Link>
      </div>
    </div>
  );
};

export default Certificate;
