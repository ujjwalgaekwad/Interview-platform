import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const roles = [
  {
    title: "Frontend Developer",
    description:
      "A Frontend Developer should be proficient in HTML, CSS, and JavaScript, along with frameworks.",
  },
  {
    title: "Backend Developer",
    description:
    "A Java Developer should be skilled in Java, Spring Boot, Hibernate, and database management using SQL.",
  },
  {
    title: "FullStack Developer",
    description:
    "A Full-Stack Developer works with HTML, CSS, JavaScript, React, Angular, Node.js, Express.js, Django, Spring Boot, MongoDB, MySQL, PostgreSQL, and DevOps tools.",
  },
];

function SelectRoles() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mt-12 mb-4 rounded-xl py-1 h-15 w-fit text-left transition duration-300">
        Interview Option
      </h1>

      {/* Grid Layout: 2 Columns on Medium Screens & Above */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-full gap-3">
        {roles.map((role, index) => (
          <Card 
            key={index}
            className="dark:bg-zinc-800 dark:text-neutral-300 p-6 cursor-pointer transition duration-300 hover:scale-[103%] hover:shadow-lg hover:bg-neutral-100 dark:hover:bg-zinc-700/70"
            onClick={() => navigate("/interview")}
          >
            <CardHeader className="py-1 px-0">
              <CardTitle className="text-2xl font-medium">{role.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-gray-600 dark:text-gray-400 text-sm">{role.description}</p>
            </CardContent>
          </Card>
        ))}
        
        {/* Add More Roles Card */}
        <Card
          className="dark:bg-zinc-800 dark:text-neutral-300 py-10 flex items-center justify-center cursor-pointer transition duration-300 hover:scale-[103%] hover:shadow-lg hover:bg-neutral-100 dark:hover:bg-zinc-700/70"
          onClick={() => navigate("/bhai-roles page kaha hai")}
        >
          <CardContent className="flex p-0 items-center justify-center h-full">
            <Plus size={32} className="text-neutral-300" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SelectRoles;
