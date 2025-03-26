import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import SessionInfoForm from "../interview/SessionInfoForm";

const roles = [
    { title: "Frontend Developer", description: "A Frontend Developer should be proficient in HTML, CSS, and JavaScript, along with frameworks." },
    { title: "Backend Developer", description: "A Backend Developer should have expertise in Node.js, Express, databases, and RESTful APIs." },
    { title: "MERN Stack Developer", description: "A MERN Stack Developer must have expertise in MongoDB, Express.js, React, and Node.js." }
];

function SelectRoles() {
    const [open, setOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
 
    return (
        <div>
            <h1>InterView Roles</h1>
            <div className="flex justify-between flex-wrap">
            {roles.map((role, index) => (
                <Card
                    key={index}
                    className="dark:bg-[#212121] hover:dark:bg-[#303030] dark:text-neutral-300 w-[310px] cursor-pointer"
                    onClick={() => {
                        setSelectedRole(role.title); // Set selected role
                        setOpen(true); // Open modal
                    }}
                >
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">{role.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs">{role.description}</p>
                    </CardContent>
                </Card>
            ))}
            <Card
                className="dark:bg-[#212121] dark:text-neutral-300 w-72 flex items-center justify-center cursor-pointer"
                onClick={() => setOpen(true)}
            >
                <CardContent className="flex items-center justify-center h-full">
                    <Plus size={32} className="text-neutral-300" />
                </CardContent>
            </Card>

            {/* SessionInfoForm Dialog */}
            <SessionInfoForm open={open} setOpen={setOpen} jobRole={selectedRole} />
        </div>
        </div>
    );
}

export default SelectRoles;
