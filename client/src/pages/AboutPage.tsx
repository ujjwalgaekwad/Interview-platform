import { Card, CardContent } from "@/components/ui/card";
import { FaTwitter, FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="container mx-auto p-6 space-y-6 max-w-3xl">
      {/* About Section */}
      <Card className="shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-gray-900 dark:text-white transition-all border border-gray-200 dark:border-gray-700">
        <CardContent className="p-8">
          <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
            <FaInfoCircle className="mr-2 text-indigo-600 dark:text-indigo-400" /> About Us
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
            Welcome to <span className="font-bold text-indigo-600 dark:text-indigo-400">EdHire</span>! We are an innovative platform focused on transforming
            EdTech by integrating AI-driven interviews and a real-time collaborative code editor. Our AI Interview system provides an adaptive,
            intelligent hiring experience, while our advanced Code Editor allows seamless coding, debugging, and collaboration.
            Through these tools, we empower developers, educators, and companies to optimize learning and hiring processes.
          </p>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card className="shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-gray-900 dark:text-white transition-all border border-gray-200 dark:border-gray-700">
        <CardContent className="p-8">
          <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">Contact Information
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
            For AI Interviews and Code Editor support, feel free to reach out to us:
          </p>
          <ul className="mt-4 space-y-3 text-gray-700 dark:text-gray-300 text-lg">
            <li className="flex items-center"><FaEnvelope className="mr-2 text-indigo-600 dark:text-indigo-400" /><strong>Email:</strong> <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline"> EdHire@gmail.com</a></li>
            <li className="flex items-center"><FaPhone className="mr-2 text-green-600 dark:text-green-400" /><strong>Phone:</strong> +91 99999999</li>
            <li className="flex items-center"><FaMapMarkerAlt className="mr-2 text-red-600 dark:text-red-400" /><strong>Address:</strong> Ahmedabad, Gujarat</li>
          </ul>
          <div className="flex space-x-6 mt-6">
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 text-3xl hover:text-blue-700 dark:hover:text-blue-600 transition-all">
              <FaTwitter />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-500 text-3xl hover:text-blue-900 dark:hover:text-blue-400 transition-all">
              <FaLinkedin />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-gray-400 text-3xl hover:text-gray-600 dark:hover:text-gray-300 transition-all">
              <FaGithub />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}