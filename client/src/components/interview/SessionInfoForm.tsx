import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import SkillsInput from "./SkillsInput";
import useInterviewStore from "@/store/interviewStore";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

// Form Schema
const formSchema = z.object({
  yearsOfExperience: z
    .number()
    .min(0, "Experience must be a positive number")
    .max(50, "Experience cannot exceed 50 years"),
  jobRole: z.string(),
  skills: z.array(z.string()).nonempty("At least one skill is required"),
});

function SessionInfoForm({ open, setOpen, jobRole }: { open: boolean; setOpen: (val: boolean) => void; jobRole: string | null }) {
  const { setCandidate } = useInterviewStore();
  const navigate = useNavigate();
  const user = useUser().user;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearsOfExperience: 0,
      jobRole: jobRole || "Frontend Developer",
      skills: []
    } 
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setCandidate({
      email: user?.primaryEmailAddress?.emailAddress || null,
      name: user?.username || null,
      yearsOfExperience: values.yearsOfExperience,
      jobRole: values.jobRole,
      skills: values.skills
    });
    setOpen(false); // Close modal after submission
    navigate(`/interview/${Date.now()}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start session</DialogTitle>
          <DialogDescription>Fill the form below to start a new session</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="jobRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Role</FormLabel>
                  <FormControl>
                    <Input value={jobRole || ""} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Years of Experience"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <SkillsInput value={field.value || []} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default SessionInfoForm;
