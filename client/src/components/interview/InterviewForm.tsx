import { toast } from "@/hooks/use-toast";
import { useClerk } from "@clerk/clerk-react";
import axios, { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const InterviewForm = () => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    linkedin: "",
    higherEducation: "",
    college: "",
    currentJobRole: "",
    achievements: "",
    github: "",
  });

  const user = useClerk().user

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true)

    try {
      const data = {
        name: formData.name,
        phone: formData.phone,
        email: user?.emailAddresses[0].emailAddress,
        linkedin: formData.linkedin,
        higherEducation: formData.higherEducation,
        college: formData.college,
        jobRole: formData.currentJobRole || null,
        achievements: formData.achievements,
        github: formData.github,
      }
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/v1/users`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      });

      if (res.status === 201) {
        toast({
          title: "Form submitted successfully",
        })
        navigate("/dashboard")
      }

    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) {
        if(error.response?.status === 400 && error.response.data.error === "User with this email already exists") {
          toast({
            title: "You already filled this details"
          })
          navigate("/dashboard")
        }
        toast({
          title: error.message,
        })
      } else {
        console.log(error)
      }
    } finally {
      setLoading(false)
    }
  };

  return (
    <main className="flex items-center justify-center min-h-[85vh]">
      <div
        className="max-w-xl w-full bg-zinc-200 dark:bg-zinc-800 shadow-lg rounded-2xl p-6"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Interview AI Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full border bg-zinc-100/70 dark:bg-zinc-700/70 rounded-lg !text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full border bg-zinc-100/70 dark:bg-zinc-700/70 rounded-lg !text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <Input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="Enter your LinkedIn profile URL"
            className="w-full border bg-zinc-100/70 dark:bg-zinc-700/70 rounded-lg !text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <Input
            type="text"
            name="higherEducation"
            value={formData.higherEducation}
            onChange={handleChange}
            placeholder="Enter your higher education (e.g. Bachelor's degree)"
            className="w-full border bg-zinc-100/70 dark:bg-zinc-700/70 rounded-lg !text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <Input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            placeholder="Enter your college name"
            className="w-full border bg-zinc-100/70 dark:bg-zinc-700/70 rounded-lg !text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <Input
            type="text"
            name="currentJobRole"
            value={formData.currentJobRole}
            onChange={handleChange}
            placeholder="Enter your current job role (e.g. Software Developer) if any or leave it blank"
            className="w-full border bg-zinc-100/70 dark:bg-zinc-700/70 rounded-lg !text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Input
            type="url"
            name="github"
            value={formData.github}
            onChange={handleChange}
            placeholder="GitHub repository URL"
            className="w-full border bg-zinc-100/70 dark:bg-zinc-700/70 rounded-lg !text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <Textarea
            name="achievements"
            value={formData.achievements}
            onChange={handleChange}
            placeholder="List your key achievements"
            className="w-full border bg-zinc-100/70 dark:bg-zinc-700/70 rounded-lg !text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            {loading ? <span className="flex justify-center items-center space-x-2"><Loader2 className="animate-spin" /> <span>Submitting...</span></span> : "Submit"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default InterviewForm